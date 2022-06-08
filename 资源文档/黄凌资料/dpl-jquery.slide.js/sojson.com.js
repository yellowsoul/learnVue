/* Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.16
 *
 * Requires: jQuery >= 1.2.3
 */
(function(b) {
    b.fn.addBack = b.fn.addBack || b.fn.andSelf;
    b.fn.extend({
        actual: function(v, a) {
            if (!this[v]) {
                throw '$.actual => The jQuery method "' + v + '" you called does not exist'
            }
            var r = {
                absolute: false,
                clone: false,
                includeMargin: false
            };
            var o = b.extend(r, a);
            var s = this.eq(0);
            var p, n;
            if (o.clone === true) {
                p = function() {
                    var c = "position: absolute !important; top: -1000 !important; ";
                    s = s.clone().attr("style", c).appendTo("body")
                };
                n = function() {
                    s.remove()
                }
            } else {
                var q = [];
                var t = "";
                var u;
                p = function() {
                    u = s.parents().addBack().filter(":hidden");
                    t += "visibility: hidden !important; display: block !important; ";
                    if (o.absolute === true) {
                        t += "position: absolute !important; "
                    }
                    u.each(function() {
                        var c = b(this);
                        var d = c.attr("style");
                        q.push(d);
                        c.attr("style", d ? d + ";" + t : t)
                    })
                };
                n = function() {
                    u.each(function(c) {
                        var d = b(this);
                        var e = q[c];
                        if (e === undefined) {
                            d.removeAttr("style")
                        } else {
                            d.attr("style", e)
                        }
                    })
                }
            }
            p();
            var m = /(outer)/.test(v) ? s[v](o.includeMargin) : s[v]();
            n();
            return m
        }
    })
})(jQuery);
(function(e, f) {
    function d(g) {
        this.config = f.extend({}, d.config, g);
        this._init()
    }
    d.config = {
        stay: 2000,
        delay: 200,
        animateTime: 300,
        playTo: 0,
        autoPlay: false,
        link: false,
        lazy: false,
        merge: false,
        effect: "base",
        curClass: "current",
        type: "mouseover",
        direction: "x",
        oninit: function() {},
        onchange: function() {}
    };
    d.prototype = {
        _init: function() {
            var g = this,
                o = this.config;
            if (!o.target.length) {
                return
            }
            this.target = o.target;
            this.prevBtn = o.prevBtn || null;
            this.nextBtn = o.nextBtn || null;
            this.effect = d.effect[o.effect];
            this.length = o.target.length;
            this.wrap = this.target.parent();
            if (/(?:ul|ol|dl)/i.test(this.wrap[0].tagName)) {
                this.content = this.wrap;
                this.wrap = this.wrap.parent()
            } else {
                var m = f('<div class="slideContent"></div>');
                _tmpWrap = m.get(0);
                var n = document.createDocumentFragment();
                for (var l = this.target.length - 1; l >= 0; l--) {
                    n.insertBefore(this.target[l], n.firstChild)
                }
                _tmpWrap.appendChild(n);
                this.wrap.get(0).appendChild(_tmpWrap);
                this.content = m;
                m = null;
                _tmpWrap = null
            } if (o.control !== false) {
                o.control = o.control || f(".control", this.wrap);
                if (o.control && o.control.length) {
                    this.control = o.control.not(".prev, .next");
                    if (!this.prevBtn) {
                        this.prevBtn = o.control.filter(".prev")
                    }
                    if (!this.nextBtn) {
                        this.nextBtn = o.control.filter(".next")
                    }
                } else {
                    var j = f('<ul class="control"></ul>'),
                        k = "";
                    for (var h = 0; h < this.length; h++) {
                        k += '<li><a href="javascript:;">' + (h + 1) + "</a></li>"
                    }
                    k = f(k);
                    j = j.append(k);
                    this.wrap.append(j);
                    this.control = k
                }
            }
            o.oninit.call(g);
            if (this.effect) {
                this.effect.oninit.call(this)
            }
            this.playTo(o.playTo);
            if (o.autoPlay) {
                this.play()
            }
            this._attach()
        },
        _attach: function() {
            var p = this,
                m = this.config,
                k = this.control,
                j = this.prevBtn,
                g = this.nextBtn,
                n = m.type,
                h = n === "mouseover",
                l = m.delay;
            if (m.autoPlay) {
                var i = [this.wrap],
                    o = k && k.parent();
                if (o) {
                    i.push(o)
                }
                if (this.prevBtn) {
                    i.push(this.prevBtn)
                }
                if (this.nextBtn) {
                    i.push(this.nextBtn)
                }
                f.each(i, function() {
                    this.bind({
                        mouseover: function() {
                            p.stop()
                        },
                        mouseout: function() {
                            p.play()
                        }
                    })
                })
            }
            if (k && k.length) {
                k.each(function(q) {
                    var r = f(this);
                    r.bind(n, function() {
                        clearTimeout(p.delayTimer);
                        p.delayTimer = setTimeout(function() {
                            p.playTo(q)
                        }, l)
                    });
                    if (h) {
                        r.bind({
                            mouseout: function() {
                                clearTimeout(p.delayTimer)
                            },
                            click: function() {
                                clearTimeout(p.delayTimer);
                                p.playTo(q)
                            }
                        })
                    }
                    if (!m.link) {
                        r.bind("click", function(s) {
                            s.preventDefault()
                        })
                    }
                })
            }
            if (j) {
                j.bind("click", function(q) {
                    p.prev();
                    q.preventDefault()
                })
            }
            if (g) {
                g.bind("click", function(q) {
                    p.next();
                    q.preventDefault()
                })
            }
        },
        playTo: function(j) {
            var i = this.control,
                k = this.config.curClass,
                g;
            if (this.curPage === j) {
                return
            }
            this.prevPage = this.curPage;
            if (this.config.effect === "slide" && this.config.merge) {
                g = this._outBound(this.curPage);
                this.curPage = j;
                j = this._outBound(j)
            } else {
                g = this.curPage;
                j = this.curPage = this._outBound(j)
            } if (i && i.length) {
                i.eq(g).removeClass(k);
                i.eq(j).addClass(k)
            }
            if (this.config.lazy) {
                var h = this.target.eq(j);
                if (h.length && !h[0].parsed) {
                    this._lazyLoad(h)
                }
            }
            if (this.effect) {
                this.effect.onchange.call(this)
            }
            this.config.onchange.call(this)
        },
        prev: function() {
            this.playTo(this.curPage - 1)
        },
        next: function() {
            this.playTo(this.curPage + 1)
        },
        play: function() {
            var g = this;
            this.stop();
            this.timer = setInterval(function() {
                g.playTo(g.curPage + 1)
            }, g.config.stay)
        },
        stop: function() {
            clearInterval(this.timer)
        },
        _outBound: function(h) {
            var j = this.length;
            if (h >= j) {
                h %= j
            }
            if (h < 0) {
                var g = h % j;
                h = g === 0 ? 0 : (g + j)
            }
            return h
        },
        _lazyLoad: function(h) {
            var g = f("textarea", h);
            if (g.length) {
                h.html(g.val());
                h[0].parsed = true
            }
        }
    };
    d.effect = {
        base: {
            oninit: function() {
                this.target.hide().eq(this.config.playTo).show()
            },
            onchange: function() {
                var g = this.target;
                g.eq(this.prevPage).hide();
                g.eq(this.curPage).show()
            }
        },
        fade: {
            oninit: function() {
                this.content.css({
                    position: "relative",
                    overflow: "hidden"
                });
                this.target.css({
                    position: "absolute"
                });
                this.target.hide()
            },
            onchange: function() {
                var g = this.target;
                g.eq(this.prevPage).fadeOut();
                g.eq(this.curPage).fadeIn()
            }
        },
        slide: {
            oninit: function() {
                f('<div class="contentWrap" style="overflow:hidden; position: relative; zoom:1; width:100%; height:100%;"></div>').insertBefore(this.content).get(0).appendChild(this.content.get(0));
                this.contentWrap = this.content.parent();
                if (this.config.direction === "x") {
                    this.step = this.config.width || this.target.eq(0).outerWidth();
                    this.prop = "scrollLeft";
                    this.boxProp = "width"
                } else {
                    this.step = this.config.height || this.target.eq(0).outerHeight();
                    this.prop = "scrollTop";
                    this.boxProp = "height"
                }
                this.showNum = Math.floor(parseFloat(this.wrap.actual(this.boxProp)) / this.step);
                if (this.config.merge) {
                    this.showNum = Math.ceil(parseFloat(this.wrap.actual(this.boxProp)) / this.step);
                    var g = this.target.clone(true);
                    var h = document.createDocumentFragment();
                    g.each(function() {
                        h.appendChild(this)
                    });
                    this.content.get(0).appendChild(h);
                    f.merge(this.target, g);
                    this.plus = 0
                }
                if (this.config.direction === "x") {
                    this.content.width(this.step * this.target.length);
                    this.target.css("float", "left")
                }
            },
            onchange: function() {
                var t = this,
                    n = this.config,
                    q = this.prevPage === e.undefined ? 0 : this.prevPage,
                    r = this.curPage,
                    p;
                merge: if (n.merge) {
                    var m = r - q,
                        l = Math.abs(m);
                    if (this.realCurPage === e.undefined) {
                        this.realCurPage = r;
                        this.realPrevPage = q
                    }
                    if (m === 0) {
                        break merge
                    }
                    if (m > 0) {
                        if (r <= this.target.length + this.plus - this.showNum) {
                            var k = this.realCurPage;
                            this.realCurPage = this.plus === 0 ? r : this.realCurPage + 1;
                            this.realPrevPage = k;
                            break merge
                        }
                        this.realCurPage = this.target.length - this.showNum;
                        this.realPrevPage = this.realCurPage - 1;
                        var s = f.makeArray(this.target);
                        for (var j = 0; j < l; j++) {
                            var h = s.shift();
                            this.content.append(h);
                            this.target = this.content.children()
                        }
                    } else {
                        if (m < 0) {
                            if (r > this.showNum && this.realCurPage > 0) {
                                this.realPrevPage = this.realCurPage;
                                this.realCurPage--
                            } else {
                                this.realPrevPage = 1;
                                this.realCurPage = 0
                            } if (r >= this.plus) {
                                break merge
                            }
                            var s = f.makeArray(this.target);
                            for (var j = 0; j < l; j++) {
                                var h = s.pop();
                                this.content.prepend(h);
                                this.target = this.content.children()
                            }
                        }
                    }
                    this.plus += m;
                    this.contentWrap[0][this.prop] -= m * this.step
                }
                if (n.merge) {
                    p = (r - this.plus) * this.step
                } else {
                    if (r + this.showNum > this.length) {
                        r = this.length - this.showNum
                    }
                    p = r * t.step
                }
                var g = {};
                g[this.prop] = p;
                this.contentWrap.stop(true);
                this.contentWrap.animate(g, n.animateTime)
            }
        }
    };
    var a = d.focus = function(g) {
        g = f.extend({}, a.config, g);
        return new d(g)
    };
    a.prototype = d.prototype;
    a.config = {
        autoPlay: true,
        effect: "fade"
    };
    var b = d.marquee = function(g) {
        g = f.extend({}, b.config, g);
        return new d(g)
    };
    b.prototype = d.prototype;
    b.config = {
        effect: "slide",
        merge: "true",
        control: false,
        direction: "y",
        autoPlay: true
    };
    var c = d.scroll = function(g) {
        g = f.extend({}, c.config, g);
        return new d(g)
    };
    c.prototype = d.prototype;
    c.config = {
        effect: "slide",
        merge: "true",
        control: false
    };
    e.Slide = d
})(window, jQuery);