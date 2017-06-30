// g = gemArray[0][0]
// g1 = gemArray[1][0]
// gs = g.createGemSprite
// g1s = g1.createGemSprite
// gs.bringToTop()
// g1s.bringToTop()
// game.add.tween(gs).to({y: 50 + 7 * 40}, 4000, Phaser.Easing.Bounce.Out, true)
// game.add.tween(g1s).to({y: 50 + 8 * 40}, 4000, Phaser.Easing.Bounce.Out, true)


// m = medalArray[7][2]
// ms = m.medalSprite
// removedMedalGroup.add(ms)
// ms.scale.setTo(2)
// ms.x = game.world.centerX
// ms.y = game.world.centerY
// ms.anchor.setTo(0.5,0.5)
// ms.play('spin')

/**
 * Bounce ease-out.
 *
 * TODO: modify this so it bounces less
 *
 * @method Phaser.Easing.Bounce#Out
 * @param {number} k - The value to be tweened.
 * @returns {number} The tweened value.
 */
function out(k) {

    if (k < ( 1 / 2.75 )) {

        return 7.5625 * k * k;

    } else if (k < ( 2 / 2.75 )) {

        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

    } else if (k < ( 2.5 / 2.75 )) {

        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

    } else {

        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

    }

}
