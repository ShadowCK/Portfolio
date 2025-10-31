import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { t as i18nT, tTag, useI18n } from './i18n.js';

function Carousel({
  images,
  autoPlay = true,
  interval = 3000,
  circular = true,
  showIndicators = true,
  size = 'medium',
}) {
  // Re-render translated labels on language change
  useI18n();
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const count = safeImages.length;
  // No automatic sizing by measurement (disabled) — allow natural flow

  const next = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);
  const prev = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || count <= 1) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, Math.max(1200, interval));
    return () => clearInterval(timerRef.current);
  }, [autoPlay, interval, count]);

  // pause on hover
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !timerRef.current) return undefined;
    const onEnter = () => timerRef.current && clearInterval(timerRef.current);
    const onLeave = () => {
      if (autoPlay && count > 1) {
        timerRef.current = setInterval(
          () => setIndex((i) => (i + 1) % count),
          Math.max(1200, interval),
        );
      }
    };
    node.addEventListener('mouseenter', onEnter);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      node.removeEventListener('mouseenter', onEnter);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, [autoPlay, interval, count]);

  // keyboard
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [prev, next]);

  // swipe (basic)
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    let startX = 0;
    let dx = 0;
    let touching = false;
    const onTouchStart = (e) => {
      touching = true;
      startX = e.touches[0].clientX;
      dx = 0;
    };
    const onTouchMove = (e) => {
      if (!touching) return;
      dx = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (!touching) return;
      touching = false;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next();
        else prev();
      }
    };
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchmove', onTouchMove, { passive: true });
    node.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, [next, prev]);

  // Note: previously used ResizeObserver to sync container size; intentionally removed.

  // No auto height/width adjustments; container min size is set once when the first image loads.

  if (!count) return null;

  return (
    <div
      ref={containerRef}
      className="ui basic segment"
      role="region"
      aria-roledescription="carousel"
      aria-label={i18nT('slides')}
      /* No tabindex to avoid a11y lint; keyboard works via focused controls inside */
      style={{ textAlign: 'center' }}
    >
      <div className="ui buttons" aria-label="Carousel controls" style={{ marginBottom: '.5rem' }}>
        <button
          type="button"
          className="ui icon button"
          onClick={prev}
          title={i18nT('previous')}
          aria-label={i18nT('previous')}
        >
          <i className="chevron left icon" />
        </button>
        <div className="or" />
        <button
          type="button"
          className="ui icon button"
          onClick={next}
          title={i18nT('next')}
          aria-label={i18nT('next')}
        >
          <i className="chevron right icon" />
        </button>
      </div>

      {/* Container centers image; content size is unrestricted. */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '.5rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {safeImages.map((img, i) => (
          <img
            key={img.src || i}
            src={img.src}
            alt={img.alt || `Photo ${i + 1}`}
            className={`ui centered ${circular ? 'circular ' : ''}${size} image profile-image`}
            data-visible={i === index ? 'true' : 'false'}
            style={{
              display: i === index ? 'block' : 'none',
            }}
          />
        ))}
      </div>

      {showIndicators && count > 1 && (
        <div className="ui tiny buttons" aria-label={i18nT('slides')}>
          {safeImages.map((img, i) => (
            <button
              key={`ind-${img.src || img.alt || 'slide'}`}
              type="button"
              className={`ui mini button ${i === index ? 'primary' : ''}`}
              aria-label={`${i18nT('slides')} ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

class PortfolioWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalRoot = document.getElementById('modal-root');
  }

  openModal() {
    this.setState({
      isActive: true,
    });
  }

  closeModal() {
    this.setState({
      isActive: false,
    });

    // Pause all Youtube videos in the modal
    if (!this.modalRef) {
      return;
    }
    const iframes = this.modalRef.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      if (!/youtube(-nocookie)?\.com\/embed/.test(iframe.src)) {
        return;
      }
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*',
      );
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.closeModal();
      }
    });
  }

  renderModal() {
    const active = this.state.isActive;
    return ReactDOM.createPortal(
      <div
        ref={(el) => {
          this.modalRef = el;
        }}
      >
        {/* Wrap modal with Dimmer to prevent clicks inside the modal from closing it */}
        <div
          className={`ui page dimmer modals ${active ? 'visible active' : ''}`}
          onClick={(e) => {
            // Close only when clicking outside the modal dialog
            const modalEl = this.modalRef && this.modalRef.querySelector('.ui.modal');
            if (modalEl && modalEl.contains(e.target)) return;
            this.closeModal();
          }}
          role="button"
          aria-label="Close modal"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') this.closeModal();
          }}
        >
          <div
            className={`ui standard modal ${active ? 'visible active' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${this.props.id}`}
          >
            <div className="header" id={`modal-title-${this.props.id}`}>
              {this.props.title}
              <button
                type="button"
                aria-label="close"
                className="ui right floated icon button mini"
                onClick={this.closeModal}
              >
                <i aria-hidden className="close icon" />
              </button>
            </div>
            <div className="content">{this.props.details}</div>
            <div className="actions">
              <div
                className="ui primary button"
                onClick={this.closeModal}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') this.closeModal();
                }}
              >
                {i18nT('close')}
              </div>
            </div>
          </div>
        </div>
      </div>,
      this.modalRoot,
    );
  }

  render() {
    const tagColor = (tag) => {
      const t = String(tag).toLowerCase();
      if (/(award|best|honorable)/.test(t)) return 'yellow';
      if (/(react|web)/.test(t)) return 'blue';
      if (/(node|express|mongo|redis)/.test(t)) return 'green';
      if (/(unity|c#|unreal|c\+\+)/.test(t)) return 'black';
      if (/(design|ui|ux)/.test(t)) return 'purple';
      if (/(personal|team|course|internship)/.test(t)) return 'teal';
      if (/(lua|playdate|roblox)/.test(t)) return 'orange';
      return 'grey';
    };
    return (
      <>
        <div className="ui fluid card" id={`work-${this.props.id}`}>
          {/* Card Image */}
          <div
            className="image"
            onClick={this.openModal}
            role="button"
            aria-label={i18nT('open_work_details')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') this.openModal();
            }}
          >
            <img src={this.props.image} alt={this.props.title || 'Work cover'} />
          </div>
          {/* Card Content */}
          <div
            className="content"
            onClick={this.openModal}
            role="button"
            aria-label={i18nT('open_work_details')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') this.openModal();
            }}
          >
            <div className="header">{this.props.title}</div>
            <div className="meta">
              <div className="ui tiny labels">
                {this.props.tags &&
                  this.props.tags.map((tag) => (
                    <span key={String(tag)} className={`ui ${tagColor(tag)} label`}>
                      {tTag(tag)}
                    </span>
                  ))}
              </div>
            </div>
            <div className="description" style={{ marginTop: '.5rem' }}>
              {this.props.description}
            </div>
            <div className="extra content">
              <span className="right floated">{i18nT('click_to_view_details')}</span>
            </div>
          </div>
        </div>
        {this.renderModal()}
      </>
    );
  }
}

function WorkDetail({ title, description, tools, roleName, links, timeRange }) {
  // Re-render on language change for labels
  useI18n();
  return (
    <div className="work-detail ui segment">
      {title && <h2 className="ui header">{title}</h2>}
      <div className="description" style={{ marginBottom: '1rem' }}>
        {description}
      </div>
      <div className="ui relaxed list">
        {tools && (
          <div className="item">
            <div className="header">{i18nT('tools')}</div>
            <div>{tools.join(', ')}</div>
          </div>
        )}
        {roleName && (
          <div className="item">
            <div className="header">{i18nT('role')}</div>
            <div>{roleName}</div>
          </div>
        )}
        {links && links.length > 0 && (
          <div className="item">
            <div className="header">{i18nT('links')}</div>
            <div className="ui tiny buttons">
              {links.map((link, index) => (
                <a
                  key={link.href || link.text || index}
                  className="ui mini button"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.href}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}
        {timeRange && (
          <div className="item">
            <div className="header">{i18nT('time_range')}</div>
            <div>{timeRange}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function YouTubeVideo({ width, height, link }) {
  const baseUrl = 'https://www.youtube-nocookie.com/embed/';
  const [videoId, userQuery = ''] = link.split('?');
  const fullUrl = `${baseUrl}${videoId}?${userQuery}&enablejsapi=1&rel=0`;
  return (
    <iframe
      width={width || 560}
      height={height || 315}
      src={fullUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

export { PortfolioWork, WorkDetail, YouTubeVideo, Carousel };
