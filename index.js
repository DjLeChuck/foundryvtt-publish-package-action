const core = require('@actions/core');

const FOUNDRYVTT_API_URL = 'https://api.foundryvtt.com/_api/packages/release_version/';
let manifest = null;
let manifestPayload = null;

async function process() {
  try {
    // Mandatory
    const token = core.getInput('token', { required: true });
    manifest = core.getInput('manifest', { required: true });

    // Optionnal
    const dryRun = core.getInput('dry-run');
    const id = await getValue('id', true);
    const version = await getValue('version', true);
    const notes = await getValue('notes');
    const minimum = await getValue('compatibility-minimum', true);
    const verified = await getValue('compatibility-verified', true);
    const maximum = await getValue('compatibility-maximum');

    const apiPayload = {
      id,
      'dry-run': 'true' === dryRun.toLowerCase(),
      release: {
        version,
        manifest,
        notes,
        compatibility: {
          minimum,
          verified,
          maximum,
        },
      },
    };

    const response = await fetch(FOUNDRYVTT_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      method: 'POST',
      body: JSON.stringify(apiPayload),
    });

    // Error, but not from the data itself
    if (!response.ok && 400 !== response.status) {
      throw new Error(`An error occured. HTTP Code ${response.statusText}`);
    }

    const payload = await response.json();

    if ('error' === payload.status) {
      core.error(JSON.stringify(payload.errors));

      core.setFailed('An error occured. Please see the API response to get more details.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function loadManifest(url) {
  try {
    const response = await fetch(url);

    const payload = await response.json();

    if (payload?.error) {
      throw new Error(payload.error);
    }

    return payload;
  } catch (error) {
    throw new Error(`Cannot load manifest data: ${error.message}`);
  }
}

function getObjectProperty(obj, property) {
  return property.split('.').reduce((acc, key) => acc && acc[key], obj);
}

async function getManifestPayload() {
  if (null === manifestPayload) {
    manifestPayload = await loadManifest(manifest);
  }

  return manifestPayload;
}

async function getValue(key, required = false) {
  const inputValue = core.getInput(key);
  if (inputValue) {
    return inputValue;
  }

  const manifest = await getManifestPayload();
  const manifestValue = getObjectProperty(manifest, key.replace('-', '.'));
  if (manifestValue) {
    return manifestValue;
  }

  if (required) {
    throw new Error(`Required value "${key}" not found either in input nor manifest.`);
  }

  return '';
}

process();
