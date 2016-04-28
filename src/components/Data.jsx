var React            = require('react');
var Reflux           = require('reflux');
var ApiConsumerMixin = require('mozaik/browser').Mixin.ApiConsumer;
var crypto           = require('crypto');

export default React.createClass({
    displayName: 'Data',

    mixins: [
        Reflux.ListenerMixin,
        ApiConsumerMixin
    ],

    getInitialState() {
        return {
            title: null,
            values: null,
            error: false,
            jsonProcExpr: null,
            jsonUrl: null,
            jsonHeaders : null
        };
    },

    getApiRequest() {
        return {
          id: "jsonfeed.data." + crypto.createHash('md5').update(this.props.jsonUrl+this.props.values).digest("hex"),
          params: {
            title: this.props.title,
            values: this.props.values,
            jsonUrl: this.props.jsonUrl,
            jsonHeaders: this.props.jsonHeaders
          }
        };
    },

    processJson(data) {
      if (typeof this.props.jsonProcExpr !== 'undefined') {
        var processJson = eval(this.props.jsonProcExpr);
        data = processJson(data);
      }
      return data;
    },

    findProps(obj, props, defval) {
      if (obj == undefined) {
        return null;
      }
      var values = [];
      if (typeof defval === 'undefined') defval = null;
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (typeof prop !== 'undefined' && prop && prop.match(/\$\{.*\}/)) {
            // ${key.prop.value} -> key.prop.value
            prop = prop.split('${')[1].split('}')[0]
            // key.prop.value -> [key, prop, value]
            prop = prop.split('.');
            var value = obj;
            for (var j = 0; j < prop.length; j++) {
                if(typeof value[prop[j]] == 'undefined') {
                    value = defval;
                    break;
                  }
                value = value[prop[j]];
            }
            values[i] = value;
          }
        }
        return values;
    },

    onApiData(data) {
        this.setState({
            title: this.props.title,
            values: this.findProps(this.processJson(data), this.props.values),
			error: !data || !!data.e
        });
    },

    render() {
        var title = "unknown", value = "unknown";
        var valuesClass = this.state.error ? "jsonwidget__values--error" : "jsonwidget__values";

        if (this.state.title){
            title = this.state.title;
        }
        if (this.state.values){
          var values = [];
          for (var i = 0; i < this.state.values.length; i++) {
            values.push(<div className="jsonwidget__value">
                <span>
                    {this.state.values[i]}
                </span>
              </div>);
          }
        }

        return (
            <div className="widget jsonwidget">
                <div className="widget__header">
                    <span className="widget__header__subject">
                        {title}
                    </span>
                    <i className="fa fa-table" />
                </div>
                <div className={valuesClass}>
                    {values}
                </div>
            </div>
        );
    }
});
