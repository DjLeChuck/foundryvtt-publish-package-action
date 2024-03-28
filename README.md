# FoundryVTT publish package action

This action allow you to publish a package on the FoundryVTT website.

## Inputs

### `token`

**Required** Package Release Token - Found accessing the edit page of your package on the FoundryVTT website.

### `dry-run`

Do a dry-run. The API will validate and process your request, but not save any changes. Default `"true"`.

### `id`

**Required** The required ID of your package, as listed in your package manifest.

### `release-version`

**Required** The required string representing the package version number. A semantic version number is preferred, such
as "1.0.0".

### `release-manifest`

**Required** The required string for the URL of your package manifest. Please Note: This is not the package manifest URL
in your package manifest, which should be pointed to a latest branch. Instead, it should point to a specific release to
allow users to download this specific version of your package.

### `release-notes`

The optional string for the URL of your release notes for this version of your package. As with your manifest URL, we
prefer this to be a discrete list of changes for this release for ease of accessing the most up-to-date, correct
information.

### `compatibility-minimum`

**Required** The required string for the Foundry version before which this module cannot function. This prevents
installation for users on these incompatible versions.

### `compatibility-verified`

**Required** The required string for the most recent Foundry version during which this module has been verified to work
correctly. This is a suggestion to users to run either exactly or at most this version of Foundry when installing the
module, but will not prevent installation.

### `compatibility-maximum`

The optional string for the Foundry version which this module has been verified to no longer function. We recommend not
setting this value unless you have tested or received reports about your module no longer working in a recent version of
Foundry, as it will prevent installation for any user at or after that version. As with minimum, this prevents
installation for users on these incompatible versions.

## Example usage

```yaml
uses: djlechuck/foundryvtt-publish-package-action@v1
with:
    token: ${{ secrets.FOUNDRYVTT_RELEASE_TOKEN }}
    dry-run: 'false'
    id: 'example-module'
    release-version: '1.0.0'
    release-manifest: 'https://github.com/example/example-module/issues/releases/download/release-1.0.0/system.json'
    release-notes: 'https://github.com/example/example-module/releases/tag/release-1.0.0'
    compatibility-minimum: '11'
    compatibility-verified: '11.315'
```
