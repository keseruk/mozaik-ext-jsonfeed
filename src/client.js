import request from 'superagent-bluebird-promise';
import config  from './config';
import chalk   from 'chalk';

/**
 * @param {Mozaik} mozaik
 */
const client = function (mozaik) {

    mozaik.loadApiConfig(config);

    function buildApiRequest() {
        let url     = config.get('jsonfeed.url');
        let headers = config.get('jsonfeed.headers');
        let req     = request.get(url);

        headers.forEach(function(header){
            req.set(header.name, header.value);
        });
        mozaik.logger.info(chalk.yellow(`[jsonfeed] calling ${ url }`));

        return req.promise();
    }

    const apiCalls = {
        data(params) {
            return buildApiRequest()
                .then(res => JSON.parse(res.text))
            ;
        }
    };
    return apiCalls;
};

export { client as default };
