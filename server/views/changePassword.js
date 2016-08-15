import ejs from "ejs";
import { readFileSync } from "fs";
import path from "path";

export default () => {

  const formTemplate = readFileSync(path.join(__dirname, './formTemplate.html'), 'utf-8');
  const changePassword = readFileSync(path.join(__dirname, './changePassword.html'), 'utf-8');

  return (req, res) => {
    res.send(ejs.render(changePassword, {
      formTemplate: formTemplate.split(/\n/g).join('')
    }, {
      escape: false
    }));
  };
};
