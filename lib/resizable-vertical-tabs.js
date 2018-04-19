'use babel';

var tabBar = null;

let switchTabPosition = setToRightSide => {
  let atomPane = document.querySelector('.vertical atom-pane');
  if (atomPane) {
    atomPane.style.flexDirection = setToRightSide ? 'row-reverse' : 'row';
  }
}

function initialiseResize(e) {
    window.addEventListener('mousemove', startResizing, false);
    window.addEventListener('mouseup', stopResizing, false);
}
function startResizing(e) {
    // Do resize here
    changeTabBarWidth(e.clientX - tabBar.offsetLeft);
    // prevent selection of text
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}
function stopResizing(e) {
    window.removeEventListener('mousemove', startResizing, false);
    window.removeEventListener('mouseup', stopResizing, false);
}


let changeTabBarWidth = tabBarWidth => {
  atom.config.set('resizable-vertical-tabs.tabBarWidth', tabBarWidth);
  tabBar = document.querySelector('.vertical .tab-bar');
  if (tabBar) {
      tabBar.style.width = tabBarWidth + 'px';

      var resizer = tabBar.querySelector('.resizer');
      if (!resizer) {
          resizer = document.createElement('div');
          resizer.classList.add('resizer');
		  resizer.classList.add('full-height-resizer');
		  
          tabBar.appendChild(resizer);

          resizer.addEventListener('mousedown', initialiseResize, false);
      }
  } else {
    setTimeout(function(){ changeTabBarWidth(tabBarWidth);  }.bind(this), 300);
  }

}

atom.config.onDidChange('resizable-vertical-tabs.setToRightSide', setToRightSide => {
  switchTabPosition(setToRightSide['newValue']);
});

atom.config.onDidChange('resizable-vertical-tabs.tabBarWidth', tabBarWidth => {
  changeTabBarWidth(tabBarWidth['newValue']);
});

export default {
  atomPane: null,
  tabBar: null,

  config: {
    tabBarOnRightSide: {
      type: 'boolean',
      default: false,
    },
    tabBarWidth: {
      type: 'number',
      default: '200',
    },
  },

  activate() {
    atom.config.get('resizable-vertical-tabs.tabsOnRightSide') ? switchTabPosition(true) : switchTabPosition(false);

    let tabBarWidth = atom.config.get('resizable-vertical-tabs.tabBarWidth');
    changeTabBarWidth(tabBarWidth);
  },

  deactivate() {
    atomPane[0].style.flexDirection = 'column';
    tabBar[0].style.width    = '100%';
  },
};
