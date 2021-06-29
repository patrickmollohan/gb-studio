#pragma bank 5

#include "states/Isometric.h"
#include "Actor.h"
#include "Camera.h"
#include "Collision.h"
#include "DataManager.h"
#include "GameTime.h"
#include "Input.h"
#include "Trigger.h"
#include "data_ptrs.h"

void Start_Isometric() {
  camera_offset.x = 0;
  camera_offset.y = 0;
  camera_deadzone.x = 0;
  camera_deadzone.y = 0;

  if (topdown_grid == 16) {
    // Snap to 16px grid
    player.pos.x = MUL_16(DIV_16(player.pos.x));
    player.pos.y = 8 + MUL_16(DIV_16(player.pos.y));
  }
}

void Update_Isometric() {
  UBYTE tile_x, tile_y, tile_up, tile_down, tile_left, tile_right, hit_actor;

  tile_x = DIV_8(player.pos.x);
  tile_y = DIV_8(player.pos.y);

  // Is player on an 8x8px tile?
  if ((topdown_grid == 16 && (MOD_16(player.pos.x) == 0 && MOD_16(player.pos.y) == 8)) ||
      (topdown_grid ==  8 && (MOD_8(player.pos.x)  == 0 && MOD_8(player.pos.y)  == 0))) {
    // Player landed on an tile
    // so stop movement for now
    player.moving = FALSE;

    // Check for trigger collisions
    if (ActivateTriggerAt(tile_x, tile_y, FALSE)) {
      // If landed on a trigger don't update movement this frame
      return;
    }

    // Check input to set player movement
    if ((player_move_type & MOVE_DOWN_LEFT) && INPUT_RECENT_LEFT) {
      player.rerender = TRUE;

      if (topdown_grid == 16) {
        tile_left = tile_x - 2;
        tile_down = tile_y + 1;
        // Check X collisions/bounds
        player.dir.x = (tile_x == 0 || (TileAt2x2(tile_left, tile_y - 1) & COLLISION_RIGHT)) ? 0 : -1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == image_tile_height - 1 || (TileAt2x2(tile_x, tile_down) & COLLISION_TOP)) ? 0 : 1;
      } else {
        tile_left = tile_x - 1;
        tile_down = tile_y + 1;
        // Check X collisions/bounds
        player.dir.x = (tile_x == 0 || (TileAt2x1(tile_left, tile_y) & COLLISION_RIGHT)) ? 0 : -1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == image_tile_height - 1 || (TileAt2x1(tile_x, tile_down) & COLLISION_TOP)) ? 0 : 1;
      }
      
      player.moving = player.dir.x != 0 || player.dir.y != 0;
      if (!player.moving) {
        player.dir.x = -1;
        player.dir.y = 1;
      }
    }
    
    if ((player_move_type & MOVE_UP_RIGHT) && INPUT_RECENT_RIGHT) {
      player.rerender = TRUE;

      if (topdown_grid == 16) {
        tile_right = tile_x + 2;
        tile_up = tile_y - 3;
        // Check X collisions/bounds
        player.dir.x = (tile_x == image_tile_width - 2 || (TileAt2x2(tile_right, tile_y - 1) & COLLISION_LEFT)) ? 0 : 1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == 0 || (TileAt2x2(tile_x, tile_up) & COLLISION_BOTTOM)) ? 0 : -1;
      } else {
        tile_right = tile_x + 1;
        tile_up = tile_y - 1;
        // Check X collisions/bounds
        player.dir.x = (tile_x == image_tile_width - 2 || (TileAt2x1(tile_right, tile_y) & COLLISION_LEFT)) ? 0 : 1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == 0 || (TileAt2x1(tile_x, tile_up) & COLLISION_BOTTOM)) ? 0 : -1;
      }
      
      player.moving = player.dir.x != 0 || player.dir.y != 0;
      if (!player.moving) {
        player.dir.x = 1;
        player.dir.y = -1;
      }
    }
    
    if ((player_move_type & MOVE_UP_LEFT) && INPUT_RECENT_UP) {
      player.rerender = TRUE;

      if (topdown_grid == 16) {
        tile_left = tile_x - 2;
        tile_up = tile_y - 3;
        // Check X collisions/bounds
        player.dir.x = (tile_x == 0 || (TileAt2x2(tile_left, tile_y - 1) & COLLISION_RIGHT)) ? 0 : -1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == 0 || (TileAt2x2(tile_x, tile_up) & COLLISION_BOTTOM)) ? 0 : -1;
      } else {
        tile_left = tile_x - 1;
        tile_up = tile_y - 1;
        // Check X collisions/bounds
        player.dir.x = (tile_x == 0 || (TileAt2x1(tile_left, tile_y) & COLLISION_RIGHT)) ? 0 : -1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == 0 || (TileAt2x1(tile_x, tile_up) & COLLISION_BOTTOM)) ? 0 : -1;
      }
      
      player.moving = player.dir.x != 0 || player.dir.y != 0;
      if (!player.moving) {
        player.dir.x = -1;
        player.dir.y = -1;
      }
    }
    
    if ((player_move_type & MOVE_DOWN_RIGHT) && INPUT_RECENT_DOWN) {
      player.rerender = TRUE;

      if (topdown_grid == 16) {
        tile_right = tile_x + 2;
        tile_down = tile_y + 1;
        // Check X collisions/bounds
        player.dir.x = (tile_x == image_tile_width - 2 || (TileAt2x2(tile_right, tile_y - 1) & COLLISION_LEFT)) ? 0 : 1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == image_tile_height - 1 || (TileAt2x2(tile_x, tile_down) & COLLISION_TOP)) ? 0 : 1;
      } else {
        tile_right = tile_x + 1;
        tile_down = tile_y + 1;
        // Check X collisions/bounds
        player.dir.x = (tile_x == image_tile_width - 2 || (TileAt2x1(tile_right, tile_y - 1) & COLLISION_LEFT)) ? 0 : 1;
        // Check Y collisions/bounds
        player.dir.y = (tile_y == image_tile_height - 1 || (TileAt2x1(tile_x, tile_down) & COLLISION_TOP)) ? 0 : 1;
      }

      player.moving = player.dir.x != 0 || player.dir.y != 0;
      if (!player.moving) {
        player.dir.x = 1;
        player.dir.y = 1;
      }
    }

    hit_actor = ActorOverlapsPlayer(FALSE);
    if (hit_actor && hit_actor != NO_ACTOR_COLLISON) {
      if (actors[hit_actor].collision_group) {
        player.hit_actor = 0;
        player.hit_actor = hit_actor;
      }
    }

    // Check if walked in to actor
    if (player.moving) {
      hit_actor = ActorInFrontOfPlayer(topdown_grid, FALSE);
      if (hit_actor != NO_ACTOR_COLLISON) {
        player.hit_actor = hit_actor;
        player.moving = FALSE;
      }
    }

    if (INPUT_A_PRESSED) {
      hit_actor = ActorInFrontOfPlayer(topdown_grid, TRUE);
      if (hit_actor != NO_ACTOR_COLLISON && !actors[hit_actor].collision_group) {
        // Turn actor to face player
        actors[hit_actor].dir.x = -player.dir.x;
        actors[hit_actor].dir.y = -player.dir.y;
        actors[hit_actor].rerender = TRUE;

        // Stop player from moving
        player.moving = FALSE;

        // Run actors interact script
        ActorRunScript(hit_actor);
      }
    }
  }

  // Move player
  if (player.moving) {
    // Move actor
    if (player.move_speed == 0) {
      // Half speed only move every other frame
      if (IS_FRAME_2) {
        player.pos.x += (WORD)player.dir.x;
        player.pos.y += (WORD)player.dir.y;
      }
    } else {
      player.pos.x += (WORD)(player.dir.x * player.move_speed);
      player.pos.y += (WORD)(player.dir.y * player.move_speed);
    }
  }
}
