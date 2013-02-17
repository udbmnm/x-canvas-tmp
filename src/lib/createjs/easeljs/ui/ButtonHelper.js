xc.module.define("xc.createjs.ButtonHelper", function(exports) {

  /**
   * The ButtonHelper is a helper class to create interactive buttons from {{#crossLink "MovieClip"}}{{/crossLink}} or
   * {{#crossLink "BitmapAnimation"}}{{/crossLink}} instances. This class will intercept mouse events from an object, and
   * automatically call {{#crossLink "BitmapAnimation/gotoAndStop"}}{{/crossLink}} or {{#crossLink "BitmapAnimation/gotoAndPlay"}}{{/crossLink}},
   * to the respective animation labels, add a pointer cursor, and allows the user to define a hit state frame.
   *
   * The ButtonHelper instance does not need to be added to the stage, but a reference should be maintained to prevent
   * garbage collection.
   *
   * <h4>Example</h4>
   *     var helper = new ButtonHelper(myInstance, "out", "over", "down", false, myInstance, "hit");
   *
   * @param {BitmapAnimation|MovieClip} target The instance to manage.
   * @param {String} [outLabel="out"] The label or animation to go to when the user rolls out of the button.
   * @param {String} [overLabel="over"] The label or animation to go to when the user rolls over the button.
   * @param {String} [downLabel="down"] The label or animation to go to when the user presses the button.
   * @param {Boolean} [play=false] If the helper should call "gotoAndPlay" or "gotoAndStop" on the button when changing
   *  states.
   * @param {DisplayObject} [hitArea] An optional item to use as the hit state for the button. If this is not defined,
   *  then the button's visible states will be used instead. Note that the same instance as the "target" argument can be
   *  used for the hitState.
   * @param {String} [hitLabel] The label or animation on the hitArea instance that defines the hitArea bounds. If this is
   *  null, then the default state of the hitArea will be used.
   * @constructor
   */
  var ButtonHelper = xc.class.create({
    _init: function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
      if (!target.addEventListener) { return; }
      this.target = target;
      target.cursor = "pointer";
      this.overLabel = overLabel == null ? "over" : overLabel;
      this.outLabel = outLabel == null ? "out" : outLabel;
      this.downLabel = downLabel == null ? "down" : downLabel;
      this.play = play;
      this.setEnabled(true);
      this.handleEvent({});
      if (hitArea) {
        if (hitLabel) {
          hitArea.actionsEnabled = false;
          hitArea.gotoAndStop && hitArea.gotoAndStop(hitLabel);
        }
        target.hitArea = hitArea;
      }
    },

    /**
     * Read-only. The target for this button helper.
     *
     * @property target
     * @type MovieClip | BitmapAnimation
     */
    target: null,

    /**
     * The label name or frame number to display when the user mouses out of the target. Defaults to "over".
     *
     * @property overLabel
     * @type String | Number
     */
    overLabel: null,

    /**
     * The label name or frame number to display when the user mouses over the target. Defaults to "out".
     *
     * @property outLabel
     * @type String | Number
     */
    outLabel: null,

    /**
     * The label name or frame number to display when the user presses on the target. Defaults to "down".
     *
     * @property downLabel
     * @type String | Number
     */
    downLabel: null,

    /**
     * If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
     *
     * @property play
     * @default false
     * @type Boolean
     */
    play: false,

    /**
     * @property _isPressed
     * @type Boolean
     * @protected
     */
    _isPressed: false,

    /**
     * @property _isPressed
     * @type Boolean
     * @protected
     */
    _isOver: false,

    /**
     * Enables or disables the button functionality on the target.
     *
     * @method setEnabled
     * @param {Boolean} value
     */
    setEnabled: function(value) {
      var o = this.target;
      if (value) {
        o.addEventListener("mouseover", this);
        o.addEventListener("mouseout", this);
        o.addEventListener("mousedown", this);
      } else {
        o.removeEventListener("mouseover", this);
        o.removeEventListener("mouseout", this);
        o.removeEventListener("mousedown", this);
      }
    },

    /**
     * Returns a string representation of this object.
     *
     * @method toString
     * @return {String} a string representation of the instance.
     */
    toString: function() {
      return "[ButtonHelper]";
    },

    /**
     * @method handleEvent
     * @protected
     */
    handleEvent: function(evt) {
      var label, t = this.target, type = evt.type;
      if (type == "mousedown") {
        evt.addEventListener("mouseup", this);
        this._isPressed = true;
        label = this.downLabel;
      } else if (type == "mouseup") {
        this._isPressed = false;
        label = this._isOver ? this.overLabel : this.outLabel;
      } else if (type == "mouseover") {
        this._isOver = true;
        label = this._isPressed ? this.downLabel : this.overLabel;
      } else { // mouseout and default
        this._isOver = false;
        label = this._isPressed ? this.overLabel : this.outLabel;
      }
      if (this.play) {
        t.gotoAndPlay && t.gotoAndPlay(label);
      } else {
        t.gotoAndStop && t.gotoAndStop(label);
      }
    }
  });

  return ButtonHelper;

});