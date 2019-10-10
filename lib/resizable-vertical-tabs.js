'use babel';

var tabBar = null;

let switchTabPosition = setToRightSide => {
  let atomPane = document.querySelector('.vertical atom-pane');
  if (atomPane) {
    atomPane.style.flexDirection = setToRightSide ? 'row-reverse' : 'row';
    if (setToRightSide) {
      atomPane.classList.add('tab-are-on-right');
    } else {
      atomPane.classList.remove('tab-are-on-right');
    }

  }
}

function initialiseResize(e) {
    window.addEventListener('mousemove', startResizing, false);
    window.addEventListener('mouseup', stopResizing, false);
}
function startResizing(e) {
    // Do resize here
    let atomPane = document.querySelector('.vertical atom-pane');
    var offset = 0;
    if (atomPane.classList.contains('tab-are-on-right')) {
      offset = tabBar.getBoundingClientRect().right;
    } else {
      offset = tabBar.getBoundingClientRect().left;
    }
    changeTabBarWidth(Math.abs(e.clientX - offset));
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
          var resizeLocation = atom.config.get('resizable-vertical-tabs.resizeLocation');
          if (resizeLocation === 'right') {
            resizer.classList.add('resizer-full-height');
          } else {
            resizer.classList.add('resizer-bottom-right');
          }

          tabBar.appendChild(resizer);

          resizer.addEventListener('mousedown', initialiseResize, false);
      }
  } else {
    setTimeout(function(){ changeTabBarWidth(tabBarWidth);  }.bind(this), 300);
  }

}

atom.config.onDidChange('resizable-vertical-tabs.tabBarOnRightSide', setToRightSide => {
  switchTabPosition(setToRightSide['newValue']);
});

atom.config.onDidChange('resizable-vertical-tabs.tabBarWidth', tabBarWidth => {
  changeTabBarWidth(tabBarWidth['newValue']);
});

atom.config.onDidChange('resizable-vertical-tabs.resizeLocation', newPosition => {
  var resizer = tabBar.querySelector('.resizer');
  if (resizer) {
    tabBar.removeChild(resizer);
  }
  changeTabBarWidth(atom.config.get('resizable-vertical-tabs.tabBarWidth'));
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
    resizeLocation: {
      type: 'string',
      default: 'bottom',
      enum: [
        {value: 'bottom', description: 'Bottom corner'},
        {value: 'right', description: 'Full height'}
      ]
    }
  },

  activate() {
    atom.config.get('resizable-vertical-tabs.tabBarOnRightSide') ? switchTabPosition(true) : switchTabPosition(false);

    let tabBarWidth = atom.config.get('resizable-vertical-tabs.tabBarWidth');
    changeTabBarWidth(tabBarWidth);
  },

  deactivate() {
    atomPane[0].style.flexDirection = 'column';
    tabBar[0].style.width    = '100%';
  },
};
