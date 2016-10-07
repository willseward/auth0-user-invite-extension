module.exports = `<form class="form-horizontal" id="change-password-form" onSubmit="return handleSubmit();">

  <div class="form-group">
    <label class="control-label col-xs-2">Password</label>
    <div class="col-xs-7">
      <input class="form-control" type="password" placeholder="your password" id="password" required />
    </div>
  </div>

  <div class="form-group">
    <label class="control-label col-xs-2">Retype Password</label>
    <div class="col-xs-7">
      <input class="form-control" type="password" placeholder="retype password" id="retype-password" required />
    </div>
  </div>

  <div id="message"></div>

  <div class="form-group">
    <div class="col-xs-offset-2 col-xs-9">
      <div class="btn-toolbar">
        <button class="btn btn-primary" id="saveBtn">
          Save
        </button>
      </div>
    </div>
  </div>
</form>`;
