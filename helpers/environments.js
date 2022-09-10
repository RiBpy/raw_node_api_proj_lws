// module scaffolding
const environment = {};

environment.staging = {
    port: 3000,
    envName: 'staging',
};
environment.production = {
    port: 5000,
    envName: 'production',
};

// determine which environment was passed
const currentEnvironment =typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToPass =
    typeof environment[currentEnvironment] === 'object'//check if passing environment object is object type...
        ? environment[currentEnvironment]
        : environment.staging;

// export environment
module.exports = environmentToPass;
