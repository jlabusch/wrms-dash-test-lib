function fake_response(handler){
    this.data_sent = 0;
    this.data = null;
}

fake_response.prototype.json = function(j){
    this.data_sent++;
    this.data = j;
}

fake_response.prototype.charSet = function(){}

var test_org = {
    "org_id": 99999,
    "org_name": "TEST ORG",
    "name": "TEST ORG",
    "type": "monthly",
    "hours": 80,
    "cash_value": 0,
    "cash_rate": 0,
    "cash_currency": "GBP",
    "start_date": "1 October 2008",
    "end_date": "31 October 2008",
    "systems": [ 99999 ]
};

var util = require('wrms-dash-util');

var vendor_org = undefined;

require('config').get('contracts').concat([test_org]).forEach(c => {
    if (c.org_name === '__vendor'){
        vendor_org = c;
    }
    util.org_data.active().add_org(c);
});

function clone_pod(a){ return JSON.parse(JSON.stringify(a)) }

function create_dummy_org(overrides){
    let o = clone_pod(test_org);
    Object.keys(overrides).forEach(k => {
        o[k] = overrides[k];
    });
    util.org_data.active().add_org(o);
    return o;
}

create_dummy_org({
    org_id: 100,
    org_name: "Acme Co",
    name: "Acme Co - SLA 2018-2019",
    systems: [ 101 ]
});

create_dummy_org({
    org_id: 200,
    org_name: "Bas Co",
    name: "Bas Co - SLA 2017-2020",
    systems: [ 201, 202 ]
});

module.exports = {
    fake_response: fake_response,
    cp: clone_pod,
    get_test_org: (spec) => {
        if (!spec){
            return test_org;
        }
        let k = Object.keys(spec)[0];
        return util.org_data.active().get_org_by_key(k, spec[k]);
    },
    create_dummy_org: create_dummy_org,
    make_ctx: function(org){
        org = org || vendor_org;
        return {
            org: org.org_id,
            org_name: org.org_name,
            sys: clone_pod(org.systems),
            period: '2017-9'
        };
    }
}

