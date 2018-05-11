import '../../tests_helper';
import Importer from '../../../common/lib/importer';
import { App } from '../../../db/models';

test('it should be able to setup authentication', async () => {
  const auth = Importer.auth();
  expect(auth.credentials.access_token).toEqual(process.env.GOOGLE_ACCESS_TOKEN);
  expect(auth._clientSecret).toEqual(process.env.GOOGLE_OAUTH_SECRET);
  expect(auth._clientId).toEqual(process.env.GOOGLE_OAUTH_CLIENT_ID);
  expect(auth.credentials.refresh_token).toEqual(process.env.GOOGLE_REFRESH_TOKEN);
});

test.skip(
  'it should fetch apps on the spreadsheet',
  async () => {
    const apps = await Importer.import();
    const app = apps[0];
    expect(app.name).toEqual('Aragon');
    expect(app.category).toEqual('Business Tools');
    expect(app.blockchain).toEqual('Ethereum');
    expect(app.storageNetwork).toEqual('IPFS');
    expect(app.authentication).toEqual('Ethereum Web3');
    expect(app.website).toEqual('https://aragon.one/');
    expect(app.registrationIsOpen).toEqual(true);
    expect(app.openSourceUrl).toEqual('https://github.com/aragon/aragon');
  },
  15000,
);

test.skip(
  'it creates App records correctly',
  async () => {
    await Importer.import();
    const count = await App.count();
    expect(count).toBeGreaterThan(100);
  },
  15000,
);

describe('getImageURL', () => {
  test('it can fetch the right image from google apps', async () => {
    const googleUrl = 'https://photos.app.goo.gl/0LSINllTFGbqhggp2';

    const url = await Importer.getImageURL(googleUrl);
    expect(url).toMatch('https://lh3.googleusercontent.com/');
  });
});
