import React from 'react';
import ReactDOM from 'react-dom';

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
          style={{ cursor: 'pointer' }}
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
                Close
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
            aria-label="Open work details"
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
            aria-label="Open work details"
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
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
            <div className="description" style={{ marginTop: '.5rem' }}>
              {this.props.description}
            </div>
            <div className="extra content">
              <span className="right floated">Click to view details</span>
            </div>
          </div>
        </div>
        {this.renderModal()}
      </>
    );
  }
}

function WorkDetail({ title, description, tools, roleName, links, timeRange }) {
  return (
    <div className="work-detail ui segment">
      {title && <h2 className="ui header">{title}</h2>}
      <div className="description" style={{ marginBottom: '1rem' }}>
        {description}
      </div>
      <div className="ui relaxed list">
        {tools && (
          <div className="item">
            <div className="header">Tools</div>
            <div>{tools.join(', ')}</div>
          </div>
        )}
        {roleName && (
          <div className="item">
            <div className="header">Role</div>
            <div>{roleName}</div>
          </div>
        )}
        {links && links.length > 0 && (
          <div className="item">
            <div className="header">Links</div>
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
            <div className="header">Time Range</div>
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

export { PortfolioWork, WorkDetail, YouTubeVideo };
