var React            = require('react');
var Reflux           = require('reflux');
var ApiConsumerMixin = require('mozaik/browser').Mixin.ApiConsumer;

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
        };
    },

    getApiRequest() {
        return {
          id: 'jsonfeed.data',
          params: {
            title: this.props.title,
            values: this.props.values,
          }
        };
    },

    findProps(obj, props, defval) {
    console.log("findProps");
    var values = [];
    if (typeof defval === 'undefined') defval = null;
        for (var i = 0; i < props.length; i++) {
          var prop = props[i];
          console.log("prop: " + prop);
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
              console.log("values from json: " + value);
          }
        }
        return values;
    },

    onApiData(data) {
        this.setState({
            title: this.props.title,
            values: this.findProps(data, this.props.values),
        });
    },

    render() {
        var title = "unknown", value = "unknown";
        if (this.state.title){
            title = this.state.title;
        }
        if (this.state.values){
        var values = [];
        for (var i = 0; i < this.state.values.length; i++) {
          console.log("values: " + this.state.values[i]);
          values.push(<div className="jsonwidget__value">
              <span>
                  {this.state.values[i]}
              </span>
            </div>);
        }
      }

        return (
            <div className="jsonwidget">
                <div className="jsonwidget__header">
                    <span className="widget__header__subject">
                        {title}
                    </span>
                    <i className="fa fa-table" />
                </div>
                <div className="jsonwidget__values">
                    {values}
                </div>
            </div>
        );
    }
});
