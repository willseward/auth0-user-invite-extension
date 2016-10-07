import ejs from 'ejs';
import config from '../lib/config';
import formTemplate from './formTemplate';
import changePasswordTemplate from './changePasswordTemplate';

export default () => {
  return (req, res) => {
    res.send(ejs.render(changePasswordTemplate, {
      formTemplate: formTemplate.split(/\n/g).join(''),
      assets: {
        customCss: config('CUSTOM_CSS')
      }
    }, {
      escape: false
    }));
  };
};
