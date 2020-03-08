/*
 * 菜单管理模块
 */

// 获取导航菜单树
export function findNavTree() {
  const navTreeData = {
    "code": 200,
    "msg": null,
    "data": [
      {
        "id": 70,
        "parentId": 0,
        "name": "首页",
        "url": "/intro/intro",
        "type": 0,
        "icon": "fa fa-home fa-fw",
        "orderNum": 1,
        "parentName": null,
        "children": []
      },
      {
        "id": 30,
        "parentId": 0,
        "name": "会员管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-male fa-fw",
        "orderNum": 2,
        "parentName": null,
        "children": [{
          "id": 31,
          "parentId": 30,
          "name": "会员列表",
          "url": "/member/list",
          "type": 1,
          "icon": "fa fa-list fa-fw",
          "orderNum": 1,
          "parentName": "会员管理",
          "children": []
        }]
      },
      {
        "id": 50,
        "createBy": null,
        "parentId": 0,
        "name": "加盟管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-handshake-o fa-fw",
        "orderNum": 3,
        "parentName": null,
        "children": [{
          "id": 51,
          "parentId": 50,
          "name": "加盟审批",
          "url": "/join/aptitude",
          "type": 1,
          "icon": "fa fa-pencil fa-fw",
          "orderNum": 1,
          "parentName": "加盟管理",
          "children": []
        },
          {
            "id": 52,
            "parentId": 50,
            "name": "转正审批",
            "url": "/join/pay",
            "type": 1,
            "icon": "fa fa-pencil fa-fw",
            "orderNum": 2,
            "parentName": "加盟管理",
            "children": []
          }]
      },
      {
        "id": 60,
        "createBy": null,
        "parentId": 0,
        "name": "支付管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-jpy fa-fw",
        "orderNum": 4,
        "parentName": null,
        "children": [{
          "id": 61,
          "parentId": 60,
          "name": "退费申请",
          "url": "/payManage/apply",
          "type": 1,
          "icon": "fa fa-pencil-square-o fa-fw",
          "orderNum": 1,
          "parentName": "支付管理",
          "children": []
        },
          {
            "id": 62,
            "parentId": 60,
            "name": "退费记录",
            "url": "/payManage/record",
            "type": 1,
            "icon": "fa fa-file-text-o fa-fw",
            "orderNum": 2,
            "parentName": "支付管理",
            "children": []
          }]
      },
      {
        "id": 1,
        "parentId": 0,
        "name": "系统管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-cogs fa-fw",
        "orderNum": 5,
        "parentName": null,
        "children": [{
          "id": 2,
          "parentId": 1,
          "name": "用户管理",
          "url": "/sys/user",
          "perms": null,
          "type": 1,
          "icon": "fa fa-users fa-fw",
          "orderNum": 1,
          "parentName": "系统管理",
          "children": []
        }, {
          "id": 3,
          "parentId": 1,
          "name": "系统参数",
          "url": "/sys/config",
          "type": 1,
          "icon": "fa fa-cog fa-fw",
          "orderNum": 2,
          "parentName": "系统管理",
          "children": []
        },{
          "id": 4,
          "parentId": 1,
          "name": "角色管理",
          "url": "/sys/role",
          "type": 1,
          "icon": "fa fa-user-circle-o fa-fw",
          "orderNum": 3,
          "parentName": "系统管理",
          "children": []
        },{
            "id": 5,
            "parentId": 1,
            "name": "加盟协议",
            "url": "/sys/protocol",
            "type": 1,
            "icon": "fa fa-file fa-fw",
            "orderNum": 4,
            "parentName": "系统管理",
            "children": []
          },
          {
            "id": 6,
            "parentId": 1,
            "name": "广告管理",
            "url": "/sys/advertising",
            "type": 1,
            "icon": "fa fa-file-image-o fa-fw",
            "orderNum": 5,
            "parentName": "系统管理",
            "children": []
          }]
      }]
  }
  return {
    url: 'menu/findNavTree',
    type: 'get',
    data: navTreeData
  }
}

// 获取菜单树
export function findMenuTree() {
  const menuTreeData = {
    "code": 200,
    "msg": null,
    "data": [
      {
        "id": 70,
        "parentId": 0,
        "name": "首页",
        "url": "/intro/intro",
        "type": 0,
        "icon": "fa fa-home fa-fw",
        "orderNum": 1,
        "parentName": null,
        "children": []
      },
      {
        "id": 30,
        "parentId": 0,
        "name": "会员管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-male fa-fw",
        "orderNum": 2,
        "parentName": null,
        "children": [{
          "id": 31,
          "parentId": 30,
          "name": "会员列表",
          "url": "/member/list",
          "type": 1,
          "icon": "fa fa-list fa-fw",
          "orderNum": 1,
          "parentName": "会员管理",
          "children": []
        }]
      },
      {
        "id": 50,
        "createBy": null,
        "parentId": 0,
        "name": "加盟管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-handshake-o fa-fw",
        "orderNum": 3,
        "parentName": null,
        "children": [{
          "id": 51,
          "parentId": 50,
          "name": "加盟审批",
          "url": "/join/aptitude",
          "type": 1,
          "icon": "fa fa-pencil fa-fw",
          "orderNum": 1,
          "parentName": "加盟管理",
          "children": []
        },
          {
            "id": 52,
            "parentId": 50,
            "name": "转正审批",
            "url": "/join/pay",
            "type": 1,
            "icon": "fa fa-pencil fa-fw",
            "orderNum": 2,
            "parentName": "加盟管理",
            "children": []
          }]
      },
      {
        "id": 60,
        "createBy": null,
        "parentId": 0,
        "name": "支付管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-jpy fa-fw",
        "orderNum": 4,
        "parentName": null,
        "children": [{
          "id": 61,
          "parentId": 60,
          "name": "退费申请",
          "url": "/payManage/apply",
          "type": 1,
          "icon": "fa fa-pencil-square-o fa-fw",
          "orderNum": 1,
          "parentName": "支付管理",
          "children": []
        },
          {
            "id": 62,
            "parentId": 60,
            "name": "退费记录",
            "url": "/payManage/record",
            "type": 1,
            "icon": "fa fa-file-text-o fa-fw",
            "orderNum": 2,
            "parentName": "支付管理",
            "children": []
          }]
      },
      {
        "id": 1,
        "parentId": 0,
        "name": "系统管理",
        "url": null,
        "type": 0,
        "icon": "fa fa-cogs fa-fw",
        "orderNum": 5,
        "parentName": null,
        "children": [{
          "id": 2,
          "parentId": 1,
          "name": "用户管理",
          "url": "/sys/user",
          "perms": null,
          "type": 1,
          "icon": "fa fa-users fa-fw",
          "orderNum": 1,
          "parentName": "系统管理",
          "children": []
        }, {
          "id": 3,
          "parentId": 1,
          "name": "系统参数",
          "url": "/sys/config",
          "type": 1,
          "icon": "fa fa-cog fa-fw",
          "orderNum": 2,
          "parentName": "系统管理",
          "children": []
        },{
          "id": 4,
          "parentId": 1,
          "name": "角色管理",
          "url": "/sys/role",
          "type": 1,
          "icon": "fa fa-user-circle-o fa-fw",
          "orderNum": 3,
          "parentName": "系统管理",
          "children": []
        },{
          "id": 5,
          "parentId": 1,
          "name": "加盟协议",
          "url": "/sys/protocol",
          "type": 1,
          "icon": "fa fa-file fa-fw",
          "orderNum": 4,
          "parentName": "系统管理",
          "children": []
        },
          {
            "id": 6,
            "parentId": 1,
            "name": "广告管理",
            "url": "/sys/advertising",
            "type": 1,
            "icon": "fa fa-file-image-o fa-fw",
            "orderNum": 5,
            "parentName": "系统管理",
            "children": []
          }]
      }]
  }
  return {
    url: 'menu/findMenuTree',
    type: 'get',
    data: menuTreeData
  }
}

export function setParentName(data) {
  if (data == null) {
    return
  }
  let len = data.length
  for (let i = 0; i < len; i++) {
    let menu = data[i]
    menu.parentName = 'menu' + menu.parentId
    if (menu.children != null) {
      setParentName(menu.children)
    }
  }
}

