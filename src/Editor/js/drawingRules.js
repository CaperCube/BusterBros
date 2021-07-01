//On mouse down
//  if tile exists in curent mouse pos
//      if tile is NOT the same tsIndex
//          change to paint
//          replace tile
//      else if tile is the same
//          change to erase-mode
//          erase tile
//  else
//      change to paint mode
//      new tile

//On mouse move
//  if tile exists in curent mouse pos
//      else if mode = erase
//          erase tile
//      else if mode = paint
//          replace tile tsIndex
//  else
//      if mode = erase
//          do nothing
//      if mode = paint
//          new tile