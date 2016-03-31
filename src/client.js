import request from 'superagent-bluebird-promise';
import config  from './config';
import chalk   from 'chalk';

/**
 * @param {Mozaik} mozaik
 */
const client = function (mozaik) {

    function buildApiRequest(params) {
        const { jsonUrl, jsonHeaders } = params;
        let req = request.get(jsonUrl);

        if (jsonHeaders != undefined) {
          jsonHeaders.forEach(function(header){
              req.set(header.name, header.value);
          });
        }
        mozaik.logger.info(chalk.yellow(`[jsonfeed] calling ${ jsonUrl }`));

        return req.promise();
    }

    const apiCalls = {
        data(params) {
            return buildApiRequest(params)
                .then(res => JSON.parse(res.text), error => mozaik.logger.error(error))
            ;
        }
    };
    return apiCalls;
};

export { client as default };
