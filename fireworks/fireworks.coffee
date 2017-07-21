###
  Fireworks: Yay happyfuntimes
###

class FireBit
  constructor: (@context, @x, @y, @ticks=0) ->
    angle = 2 * Math.PI * Math.random()
    mag = Math.random()
    @vx = mag * Math.cos angle
    @vy = mag * Math.sin angle
    @color = '#' + Math.round(0xffffff * Math.random()).toString(16)
    @life = 100 + Math.random() * 50

  tick: ->
    @x += @vx
    @y += @vy
    @vy += 0.005
    @ticks++

    @context.beginPath()
    @context.arc @x, @y, 3, 0, 2 * Math.PI, true
    @context.fillStyle = @color
    @context.fill()

    this


class FireController
  constructor: (@canvas, @notify) ->
    {clientWidth: @canvas.width, clientHeight:@canvas.height} = document.documentElement
    @context = @canvas.getContext '2d'
    @bits = []

  firework: (x, y) ->
    @bits.push new FireBit @context, x, y for i in [1..30]

  check: (bit) ->
    bit.y < @canvas.height && bit.ticks < bit.life && 0 < bit.x < @canvas.width

  tick: () ->
    @context.clearRect 0, 0, @canvas.width, @canvas.height
    @bits = (bit.tick() for bit in @bits when @check bit)

  start: () ->
    randwork = =>
      x = Math.random() * @canvas.width
      y = Math.random() * @canvas.height
      if @bits.length < 100
        @firework x, y
      setTimeout randwork, Math.random()*200+200
    randwork()

    go = =>
      @tick()
      @notify.innerHTML = "Particles: #{@bits.length}"

    setInterval go, 8
    this

first = (tag) -> (document.getElementsByTagName tag)[0]
fctl = (new FireController (first 'canvas'), (first 'p')).start()
(first 'canvas').onmousedown = (e) =>
  c = e.target
  fctl.firework e.clientX - c.offsetLeft, e.clientY - c.offsetTop
