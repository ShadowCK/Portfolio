const React = require('react');

class PortfolioWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.closeModal();
      }
    });
  }

  render() {
    return (
      <div className="card">
        {/* Card Image */}
        <div className="card-image" onClick={this.openModal}>
          <figure className="image is-4by3">
            <img src={this.props.image} alt="作品图片" />
          </figure>
        </div>
        {/* Card Content */}
        <div className="card-content" onClick={this.openModal}>
          <div className="media">
            <div className="media-content">
              <p className="title is-4">{this.props.title}</p>
              <p className="subtitle is-6">{this.props.description}</p>
            </div>
          </div>
          <div className="content">点击查看更多信息。</div>
        </div>
        {/* Modal */}
        <div className={`modal ${this.state.isActive ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={this.closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{this.props.title}</p>
              <button className="delete" aria-label="close" onClick={this.closeModal}></button>
            </header>
            <section className="modal-card-body">
              作品详细信息，如创作过程、使用技术等。
              {this.props.details}
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={this.closeModal}>
                关闭
              </button>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = {
  PortfolioWork,
};
