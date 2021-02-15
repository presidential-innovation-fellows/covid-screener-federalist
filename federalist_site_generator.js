// script to run during federalist app deployment
const fs = require('fs');
const util = require('util');

var site_home = '_site';

fs.exists('_site', function(exists) {
    if(!exists)
        fs.mkdirSync(site_home);
});

process.env.BASEURL

var template_string='';
const readFile = util.promisify(fs.readFile);
let templ_file_name = 'site.template.html';
// read template file
readFile(templ_file_name, {encoding:'utf8', flag:'r'}).then(template => {
    
    template_string = template;

    var fac_utils = require('./facility_helpers');
    var facilities = require('./Facilities');
    var flowcharts = require('./Flowcharts');
    var facility_handle = '{facility_json_array_element}';
    var flowchart_handle = '{flow_json_array_element}';    

    try {        

        // replace BASEURL
        let base_url_str = process.env.BASEURL;
        let base_url_handle = '{base_url}';
        console.log('ENV BASE URL: ' + base_url_str);

        // base_url_str = './';
        // console.log('USING BASE URL: ' + base_url_str);

        while(template_string.search(base_url_handle) != -1)
            template_string = template_string.replace(base_url_handle, base_url_str);

        facilities.forEach( (fac) => {
            
            let fac_id = fac.id;
            let flow_id = fac.flow_id;
            let flow = fac_utils.get_flowchart_JSON_by_id(flow_id);
            if(flow!==undefined){
                console.log('Working on: ' + fac_id + ") " + fac.name);
                let first_repl = '';
                first_repl = template_string.replace(facility_handle, JSON.stringify(fac));
                let html_string = first_repl.replace(flowchart_handle, JSON.stringify(flow));

                let path = '';
                if(fac.hasOwnProperty('generate_site')) {
                    if(fac.generate_site)
                    {

                        if(fac.hasOwnProperty('default'))
                        {
                            if(fac.default)
                            {
                                path = site_home + '/index.html';
                            }
                            else {
                                path = site_home + '/' + fac_id + '.' + flow_id + '.html';
                            }
                        } else {
                            path = site_home + '/' + fac_id + '.' + flow_id + '.html';
                        }
                        
                        console.log('> Creating: ' + path);
                        // create file
                        fs.writeFile(path, html_string, {encoding: "utf8", flag: "w", mode: 0o666}, 
                            (err) => { if (err) console.log(err); else { console.log("> File written successfully\n");}}
                            );
                    }
                }
            }
        }) 
    } catch(e) {
        console.log('Error creating site file: ' + e.message);
    }

});

