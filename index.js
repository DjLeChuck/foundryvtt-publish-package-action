const core = require('@actions/core');

const FOUNDRYVTT_API_URL = 'https://api.foundryvtt.com/_api/packages/release_version/';

async function process() {
  try {
    const token = core.getInput('token');
    const dryRun = core.getInput('dry-run');
    const id = core.getInput('id');
    const version = core.getInput('release-version');
    const manifest = core.getInput('release-manifest');
    const notes = core.getInput('release-notes');
    const minimum = core.getInput('compatibility-minimum');
    const verified = core.getInput('compatibility-verified');
    const maximum = core.getInput('compatibility-maximum');

    const response = await fetch(FOUNDRYVTT_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      method: 'POST',
      body: JSON.stringify({
        id,
        'dry-run': 'true' === dryRun,
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
      }),
    });

    core.setOutput('response', await response.json());
  } catch (error) {
    core.setFailed(error.message);
  }
}

process();
