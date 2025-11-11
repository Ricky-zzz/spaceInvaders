
export function initMobileControls(playerRef, startScreenRef, menuItemsRef, currentMenuIndexRef, updateMenuFocusRef) {
  const mobileUp = document.getElementById("mobile-up");
  const mobileDown = document.getElementById("mobile-down");
  const mobileLeft = document.getElementById("mobile-left");
  const mobileRight = document.getElementById("mobile-right");
  const mobileAtk = document.getElementById("mobile-atk");
  const mobileBoost = document.getElementById("mobile-boost");
  const mobileEnter = document.getElementById("mobile-enter");

  const mobileButtonStates = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    b: false
  };

  mobileUp.addEventListener("mousedown", () => {
    if (!startScreenRef.classList.contains("hidden")) {
      const event = new KeyboardEvent("keydown", { 
        code: "ArrowUp",
        key: "ArrowUp",
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  });

  mobileDown.addEventListener("mousedown", () => {
    if (!startScreenRef.classList.contains("hidden")) {
      const event = new KeyboardEvent("keydown", { 
        code: "ArrowDown",
        key: "ArrowDown",
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  });

  mobileEnter.addEventListener("mousedown", () => {
    const resultScreen = document.getElementById("result-screen");

    if (!resultScreen.classList.contains("hidden")) {
      const nextRoundBtn = document.getElementById("next-round-btn");
      const mainMenuBtn = document.getElementById("main-menu-btn");
      
      if (!nextRoundBtn.classList.contains("hidden")) {
        nextRoundBtn.click();
      } else if (!mainMenuBtn.classList.contains("hidden")) {
        mainMenuBtn.click();
      }
      return;
    }
    
    if (!startScreenRef.classList.contains("hidden")) {
      const event = new KeyboardEvent("keydown", { 
        code: "Enter",
        key: "Enter",
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  });

  mobileLeft.addEventListener("mousedown", () => {
    if (playerRef.current) playerRef.current.leftPressed = true;
    mobileButtonStates.left = true;
  });

  mobileLeft.addEventListener("mouseup", () => {
    if (playerRef.current) playerRef.current.leftPressed = false;
    mobileButtonStates.left = false;
  });

  mobileRight.addEventListener("mousedown", () => {
    if (playerRef.current) playerRef.current.rightPressed = true;
    mobileButtonStates.right = true;
  });

  mobileRight.addEventListener("mouseup", () => {
    if (playerRef.current) playerRef.current.rightPressed = false;
    mobileButtonStates.right = false;
  });

  mobileAtk.addEventListener("mousedown", () => {
    if (playerRef.current) {
      mobileButtonStates.space = true;
      playerRef.current.shootPressed = true;
    }
  });

  mobileAtk.addEventListener("mouseup", () => {
    mobileButtonStates.space = false;
    if (playerRef.current) {
      playerRef.current.shootPressed = false;
    }
  });

  mobileBoost.addEventListener("mousedown", () => {
    if (playerRef.current) {
      mobileButtonStates.b = true;
      playerRef.current.activateBoost?.();
    }
  });

  mobileBoost.addEventListener("mouseup", () => {
    mobileButtonStates.b = false;
  });

  function addTouchSupport(button, onDown, onUp) {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      onDown();
      button.style.background = "rgba(0, 255, 0, 0.3)";
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      onUp();
      button.style.background = "rgba(255, 255, 255, 0.1)";
    });
  }

  addTouchSupport(
    mobileLeft,
    () => { if (playerRef.current) playerRef.current.leftPressed = true; },
    () => { if (playerRef.current) playerRef.current.leftPressed = false; }
  );

  addTouchSupport(
    mobileRight,
    () => { if (playerRef.current) playerRef.current.rightPressed = true; },
    () => { if (playerRef.current) playerRef.current.rightPressed = false; }
  );

  addTouchSupport(
    mobileAtk,
    () => { if (playerRef.current) playerRef.current.shootPressed = true; },
    () => { if (playerRef.current) playerRef.current.shootPressed = false; }
  );

  addTouchSupport(
    mobileBoost,
    () => { if (playerRef.current) playerRef.current.activateBoost?.(); },
    () => {}
  );
}