

const ccloud_config = {
    "bootstrap.servers":"<BOOTSTRAP_SERVER>",
    "security.protocol":"SASL_SSL",
    "sasl.mechanisms":"PLAIN",
    "sasl.username":"<API_KEY>",
    "sasl.password":"<API_SECRET>"
};

module.exports = { ccloud_config };