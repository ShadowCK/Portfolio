const React = require('react');
const ReactDOM = require('react-dom');

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
    return ReactDOM.createPortal(
      <div
        ref={(el) => {
          this.modalRef = el;
        }}
        className={`modal ${this.state.isActive ? 'is-active' : ''}`}
      >
        <div className="modal-background" onClick={this.closeModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>
            <button className="delete" aria-label="close" onClick={this.closeModal}></button>
          </header>
          <section className="modal-card-body">{this.props.details}</section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.closeModal}>
              Close
            </button>
          </footer>
        </div>
      </div>,
      this.modalRoot,
    );
  }

  render() {
    return (
      <>
        <div className="card" id={`work-${this.props.id}`}>
          {/* Card Image */}
          <div className="card-image" onClick={this.openModal}>
            <figure className="image is-4by3">
              <img src={this.props.image} alt="Image of the work" />
            </figure>
          </div>
          {/* Card Content */}
          <div className="card-content" onClick={this.openModal}>
            <div className="media">
              <div className="media-content">
                <p className="title is-4">{this.props.title}</p>
                <div className="tags">
                  {this.props.tags &&
                    this.props.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                </div>
                <p className="subtitle is-6">{this.props.description}</p>
              </div>
            </div>
            <div className="content">Click to view details.</div>
          </div>
        </div>
        {this.renderModal()}
      </>
    );
  }
}

const WorkDetail = ({ title, description, tools, role, links, timeRange }) => (
  <div className="work-detail box">
    {title && <h2 className="title is-4">{title}</h2>}
    <p className="description mb-4">{description}</p>
    <div className="content">
      {tools && (
        <p>
          <strong>Tools:</strong> {tools.join(', ')}
        </p>
      )}
      {role && (
        <p>
          <strong>Role:</strong> {role}
        </p>
      )}
      {links && links.length > 0 && (
        <p>
          <strong>Links:</strong>{' '}
          {links.map((link, index) => (
            <span>
              <a
                key={index}
                className="tag is-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.href}
              >
                {link.text}
              </a>
              {index < links.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      )}
      {timeRange && (
        <p>
          <strong>Time Range:</strong> {timeRange}
        </p>
      )}
    </div>
  </div>
);

const YouTubeVideo = ({ width, height, link }) => {
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
    ></iframe>
  );
};

module.exports = {
  PortfolioWork,
  WorkDetail,
  YouTubeVideo,
};
