//---------------------------------------------------------------------------------
//- PIXI BITMAP TEXT

function PIXIText(text, style) {
    let isBitmap = true;    

    text = text + "";

    for (let i = 0; i < text.length; i++) {
        if (text[i] != " " && text[i] != "	") {
            if (assets.dataFonts[style.fontFamily] && assets.dataFonts[style.fontFamily]["rect_" + text[i]]) { } else {
                isBitmap = false;
            }
        }
    }   

    if (style.fontSize == undefined) { style.fontSize = 30; }
    if (style.letterSpacing == undefined) { style.letterSpacing = 0; }
    if (style.lineHeight == undefined) { style.lineHeight = 0; }
    if (style.color == undefined) { style.color = 0xffffff; }
    if (style.align == undefined) { style.align = "center"; }
    if (style.valign == undefined) { style.valign = "center"; }
    if (style.wordWrap == undefined) { style.wordWrap = false; }
    if (style.wordWrapWidth == undefined) { style.wordWrapWidth = 720; }
    if (style.wordWrapHeight == undefined) { style.wordWrapHeight = 720; }  

    let mcText;

    if (isBitmap) {
        mcText = new PIXI.Container();
        mcText.v_type = "bitmap";      

        let titleTexture = style.fontFamily + "@" + Math.ceil(style.fontSize);
        let fontBaseTexture = assets.textures.base[style.fontFamily];

        if (!assets.dataFonts[titleTexture]) {
            let divStorm = document.createElement("div");
            divStorm.style.display = "none";
            divStorm.style.position = "absolute";
            divStorm.style.top = "100%";
            divStorm.style.left = "100%";
            divStorm.innerHTML = '<canvas id="stageTemp_' + titleTexture + '" width="' + Math.ceil(10 + fontBaseTexture.width * style.fontSize / 100) + '" height="' + Math.ceil(10 + fontBaseTexture.height * style.fontSize / 100) + '" style="background:transparent;">';
            document.body.appendChild(divStorm);

            let _stage = document.getElementById("stageTemp_" + titleTexture);
            let _ctx = _stage.getContext && _stage.getContext('2d');

            _ctx.save();
            _ctx.drawImage(assets.textures.base[style.fontFamily], 0, 0, Math.ceil(fontBaseTexture.width * style.fontSize / 100), Math.ceil(fontBaseTexture.height * style.fontSize / 100));
            _ctx.restore();

            assets.dataFonts[titleTexture] = PIXI.Texture.from(_stage);
        }

        mcText.v_texture = assets.dataFonts[titleTexture];

    } else {
        mcText = new PIXI.Text(text, {
            fontFamily: 'sans-serif',
            fontSize: style.fontSize,
            fontWeight: 'normal',
            lineHeight: style.fontSize + style.lineHeight,
            fill: style.color,
            align: style.align,
            wordWrap: style.wordWrap,
            wordWrapWidth: style.wordWrapWidth * 2,
        });

        mcText.v_type = "text";

        if (style.align == "left") {
            mcText.anchor.x = 0.0;
        } else if (style.align == "right") {
            mcText.anchor.x = 1;
        } else {
            mcText.anchor.x = 0.5;
        }

        if (style.valign == "top") {
            mcText.anchor.y = 0.0;
        } else if (style.valign == "bottom") {
            mcText.anchor.y = 1;
        } else {
            mcText.anchor.y = 0.5;
        }
    }

    mcText.v_align = style.align;
    mcText.v_valign = style.valign;
    mcText.v_letterspacing = style.letterSpacing;
    mcText.v_lineheight = style.lineHeight;
    mcText.v_wordwrapwidth = style.wordWrapWidth;
    mcText.v_wordwrapheight = style.wordWrapHeight;
    mcText.v_wordwrap = style.wordWrap;
    mcText.v_fontFamily = style.fontFamily;
    mcText.v_fontSize = style.fontSize;
    mcText.v_tint = style.color;
    mcText.old_text = "";  

    mcText.setText = PIXIBT_SetText;
    mcText.setFont = PIXIBT_SetFont;
    mcText.setColor = PIXIBT_SetColor;

    mcText.setText(text);  

    return mcText;
}

function PIXIBT_SetFont(_fontFamily) {
    this.v_fontFamily = _fontFamily;
    this.setText(this.v_text);
}

function PIXIBT_SetColor(_color) {
    this.v_tint = _color;
    this.setText(this.v_text);
}

function PIXIBT_SetText(_text) {
    let i, j;
    let _glx = 0;
    let _gly = 0;
    let _glh = 0;
    let _aLineWidth = [];
    let _idLineWidth = 0;
    let _spaceW = 0;

    _text = _text + "";

    if (this.v_type == "bitmap") {
        for (i = 0; i < this.old_text.length; i++) {
            if (this["mcLetter" + i]) {
                this["mcLetter" + i].x = 0;
                this["mcLetter" + i].y = 0;
                this["mcLetter" + i].visible = false;
            }
            if (this["mcLetterB" + i]) {
                this["mcLetterB" + i].x = 0;
                this["mcLetterB" + i].y = 0;
                this["mcLetterB" + i].visible = false;
            }
        }

        this.old_text = _text;
        this.v_text = _text;

        _aLineWidth[_idLineWidth] = 0;

        for (i = 0; i < _text.length; i++) {
            if (_text[i] == " ") {
                _glx += _spaceW;
                _aLineWidth[_idLineWidth] += _spaceW;

                if (this.v_wordwrap && _glx > this.v_wordwrapwidth) {
                    _glx = 0;
                    _gly += _glh;

                    _idLineWidth++;
                    _aLineWidth[_idLineWidth] = 0;
                }

            } else if (_text[i] == "	") {

                _glx = 0;
                _gly += _glh;

                _idLineWidth++;
                _aLineWidth[_idLineWidth] = 0;

            } else {

                if (!this["mcLetter" + i]) {
                    this["mcLetter" + i] = new PIXI.Container();
                }
                this["mcLetter" + i].x = _glx;
                this["mcLetter" + i].y = _gly;
                this["mcLetter" + i].visible = true;
                this.addChild(this["mcLetter" + i]);

                let _dataLetter = assets.dataFonts[this.v_fontFamily]["rect_" + _text[i]];
                let _texture = this.v_texture;
                let _x = _dataLetter[0] * this.v_fontSize / 100;
                let _y = _dataLetter[1] * this.v_fontSize / 100;
                let _w = _dataLetter[2] * this.v_fontSize / 100;
                let _h = _dataLetter[3] * this.v_fontSize / 100;
                if (_x < 0) { _x = 0; }
                if (_y < 0) { _y = 0; }
                while (_x + _w > _texture.width) { _x -= 1; _w -= 1; }
                while (_y + _h > _texture.height) { _y -= 1; _h -= 1; }
                let _frame = new PIXI.Rectangle(_x, _y, _w, _h);
                let _crop = new PIXI.Rectangle(0, 0, _w, _h);
                let _trim = _crop;

                if (_spaceW == 0) { _spaceW = _w * 0.5; }

                if (!assets.dataFonts[this.v_fontFamily]["texture_letter_" + _text[i] + "_" + Math.ceil(this.v_fontSize)]) {
                    assets.dataFonts[this.v_fontFamily]["texture_letter_" + _text[i] + "_" + Math.ceil(this.v_fontSize)] = new PIXI.Texture(_texture.baseTexture, _frame, _crop, _trim, 0);
                }

                if (!this["mcLetterB" + i]) {
                    this["mcLetterB" + i] = new PIXI.Sprite();
                }
                this["mcLetterB" + i].texture = assets.dataFonts[this.v_fontFamily]["texture_letter_" + _text[i] + "_" + Math.ceil(this.v_fontSize)];
                this["mcLetterB" + i].anchor.set(0.0, 0.0);
                this["mcLetterB" + i].visible = true;
                this["mcLetterB" + i].tint = this.v_tint;
                this["mcLetterB" + i].idLine = _idLineWidth;
                this["mcLetter" + i].addChild(this["mcLetterB" + i]);

                _glx += _w + this.v_letterspacing;
                _aLineWidth[_idLineWidth] += _w + this.v_letterspacing;

                if (_glh < (_h * 0.7 + this.v_lineheight)) {
                    _glh = (_h * 0.7 + this.v_lineheight);
                }
            }
        }

        //- width / height

        if (this.width > this.v_wordwrapwidth) {
            this.scale.set(this.v_wordwrapwidth / this.width * this.scale.x);
        }

        if (this.height > this.v_wordwrapheight) {
            this.scale.set(this.v_wordwrapheight / this.height * this.scale.y);
        }

        //- align

        if (this.v_align == "center") {

            let _ww = 0;
            for (i = 0; i < _text.length; i++) {
                if (_text[i] == " ") {
                    _ww += _spaceW;
                } else if (_text[i] == "	") {
                    _ww = 0;
                } else {
                    this["mcLetter" + i].x -= (_aLineWidth[this["mcLetterB" + i].idLine]) * 0.5;
                }
            }

        } else if (this.v_align == "right") {

            let _ww = 0;
            for (i = 0; i < _text.length; i++) {
                if (_text[i] == " ") {
                    _ww += _spaceW;
                } else if (_text[i] == "	") {
                    _ww = 0;
                } else {
                    this["mcLetter" + i].x -= (_aLineWidth[this["mcLetterB" + i].idLine]);

                }
            }

        }

        //- valign

        if (this.v_valign == "center") {
            let hh = -0.5 * this.height / this.scale.x;
            for (i = 0; i < _text.length; i++) {
                if (_text[i] == " ") {
                } else if (_text[i] == "	") {
                } else {
                    this["mcLetter" + i].y += hh;
                }
            }
        } else if (this.v_valign == "bottom") {
            let hh = -this.height / this.scale.x;
            for (i = 0; i < _text.length; i++) {
                if (_text[i] == " ") {
                } else if (_text[i] == "	") {
                } else {
                    this["mcLetter" + i].y += hh;
                }
            }
        }

    } else {

        //- text

        this.text = _text;

        //- color

        this.style.fill = this.v_tint;

        //- width / height

        if (this.width > this.v_wordwrapwidth) {
            this.scale.set(this.v_wordwrapwidth / this.width * this.scale.x);
        }

        if (this.height > this.v_wordwrapheight) {
            this.scale.set(this.v_wordwrapheight / this.height * this.scale.y);
        }
    }
}