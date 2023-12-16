const React = require('react');
const ReactDOM = require('react-dom');

const { PortfolioWork } = require('./components.jsx');

const portfolioWorksData = [
  {
    id: 1,
    title: '作品1',
    description: '描述1',
    image: 'https://placehold.co/400x300',
  },
  {
    id: 2,
    title: '作品2',
    description: '描述2',
    image: 'https://placehold.co/400x300',
  },
  // More works...
];

window.onload = () => {
  ReactDOM.render(
    portfolioWorksData.map((work) => (
      <div class="column is-4">
        <PortfolioWork
          key={work.id}
          title={work.title}
          description={work.description}
          image={work.image}
        />
      </div>
    )),
    document.getElementById('works'),
  );
};
