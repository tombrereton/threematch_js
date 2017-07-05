<?php





fwrite($data_file, <<< 'END'
Preamble
===============================================================================
t = gem type
bt = bonus type
i = ice layer
mp = medal portion
mu = medals uncovered
s = score
a = action
tmo = total moves
tme = total medals
r = row
c = columns
-------------------------------------------------------------------------------
tmo	tme	r	c
===============================================================================

END
);
fwrite($data_file, $_POST['moves'] . "\t" . $_POST['medals'] . "\t");
fwrite($data_file, <<< 'END'
9	9
-------------------------------------------------------------------------------

Key for state and progress information.
2 lines represent a state-action pair:
t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	t	bt	i	mp	
===============================================================================
mu	s	a
===============================================================================


END
);
?>
