let configRouter = (router) => {
  /**
   * 路由地址映射
   * 注：使用`require.ensure`并作同一块名称声明的路由最终会打包在同一文件中
   *
   * 比如注册与登录这两个路由：
   *
   * // 注册
   * '/register': {
   *   component (resolve) {
   *     require.ensure([], (require) => {
   *       resolve(require('./views/register'))
   *     }, 'auth')
   *   }
   * },
   *
   * // 登录
   * '/login': {
   *   component (resolve) {
   *     require.ensure([], (require) => {
   *       resolve(require('./views/login'))
   *     }, 'auth')
   *   }
   * },
   *
   * 最终会打包在 `auth.js` 这个文件中
   */
  router.map({
    // 404
    '*': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/index'))
        }, 'index')
      }
    },

    // // 入口页
    // '/': {
    //   component (resolve) {
    //     require.ensure([], (require) => {
    //       resolve(require('./views/index'))
    //     }, 'index')
    //   }
    // },

    // 入口页
    '/index': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/index'))
        }, 'index')
      }
    },

    // 发布页
    '/publish': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/publish'))
        }, 'publish')
      }
    },
    // 回复页
    '/reply': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/reply'))
        }, 'reply')
      }
    },
    '/replyed': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/replyed'))
        }, 'replyed')
      }
    },

    '/detail': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/detail'))
        }, 'detail')
      }
    },
    '/album': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/album'))
        }, 'album')
      }
    },
    '/albumDetail': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/albumDetail'))
        }, 'albumDetail')
      }
    },
    '/more': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/more'))
        }, 'more')
      }
    },
    '/catalogs': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/catalogs'))
        }, 'catalogs')
      }
    },
    '/follow': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/follow'))
        }, 'follow')
      }
    },
    '/friends': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/friends'))
        }, 'friends')
      }
    },
    '/home': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/home'))
        }, 'home')
      }
    },
    '/cash': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/cash'))
        }, 'cash')
      }
    },
    '/erweima': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/erweima'))
        }, 'erweima')
      }
    },
    '/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/edit'))
        }, 'edit')
      }
    },
    '/titlelist': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/titlelist'))
        }, 'titlelist')
      }
    },
    '/login': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/login'))
        }, 'login')
      }
    },
    '/attention': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/attention'))
        }, 'attention')
      }
    },
    '/newssetting': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/newssetting'))
        }, 'newssetting')
      }
    }

    // '/expert': {
    //   component (resolve) {
    //     require.ensure([], (require) => {
    //       resolve(require('./views/expert'))
    //     }, 'index')
    //   }
    // },

    // '/audio': {
    //   component (resolve) {
    //     require.ensure([], (require) => {
    //       resolve(require('./views/audio'))
    //     }, 'audio')
    //   }
    // }

  //   // 信息填写页
  //   '/info': {
  //     component (resolve) {
  //       require.ensure([], (require) => {
  //         resolve(require('./views/info'))
  //       }, 'index')
  //     }
  //   },

  //   // 测评页
  //   '/appraise': {
  //     component (resolve) {
  //       require.ensure([], (require) => {
  //         resolve(require('./views/appraise'))
  //       }, 'index')
  //     }
  //   },

  //   // 结果页
  //   '/result': {
  //     component (resolve) {
  //       require.ensure([], (require) => {
  //         resolve(require('./views/result'))
  //       }, 'index')
  //     }
  //   },

  //   // 登录
  //   '/login': {
  //     component (resolve) {
  //       require.ensure([], (require) => {
  //         resolve(require('./views/index'))
  //       }, 'login')
  //     }
  //   }
  })

  // 重定向
  router.redirect({
    '/': '/index'
  })

  router.beforeEach((transition) => {
    transition.next()
    // if (transition.to.path === '/') {
    //   window.location.href = '/m/specialist/#!/index'
    // } else {
    //   transition.next()
    // }
    // throttle(transition)
  })
}

export default configRouter
