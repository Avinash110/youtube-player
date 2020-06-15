import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../components/App/App.js';

ReactDOM.render(
	<App />,
	document.getElementById("root")
);

if (module.hot) {
  // Whenever a new version of App.js is available
  module.hot.accept('../../components/App/App.js', function () {
    // Require the new version and render it instead
    var NextApp = require('../../components/App/App.js').default;
    ReactDOM.render(<NextApp />, document.getElementById("root"))
  })
}