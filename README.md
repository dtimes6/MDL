MDL
===

模型描述语言 综合工具源码
======================
作者: 代鹏

邮件: dtimes6@163.com

开发及运行环境
============
开发语言：javascript

运行环境：  node
单元测试：  mocha
覆盖率测试：istanbul

调试环境设置
==========
调试设置：修改 MDL/Compiler/ErrorHandling/errorhandling.js 中的 ErrorHandling 的 debug 项为 true。

测试与结果
=========
在 MDL/Test/ 目录下运行 test.sh

覆盖率测试结果位于：
MDL/Test/coverage/lcov-report/index.html

目录结构以及功能简述
=================

    /- MDL
        |- Compiler             工具套件
        |    |- Parser          语法树生成
        |
        |- Library              标准程序库
        |- Test                 单元测试

语法树节点描述
============
    parent  上一级节点
    type    节点类型
    childs  子节点 根据节点类型不同而不同
    value   【可常量】节点取值
    scope   【域】查询表格
    method  综合方法描述

语法树结构描述
============

    statement := element_decl |
                 process_decl |
                 function_decl |
                 operproc_decl |
                 operation_decl

    element_decl := '''element''' identifier

    process_decl := '''process''' identifier [template_parameter] '''(''' inst_decl [''',''' inst_decl] ''')''' [''':''' type] block
    function_decl := '''function''' identifier [template_parameter] '''(''' inst_decl [''',''' inst_decl] ''')''' [''':''' type] block
    operproc_decl := '''process''' operator [template_parameter] '''(''' inst_decl [''',''' inst_decl] ''')''' [''':''' type] block
    operation_decl := '''function''' operator [template_parameter] '''(''' inst_decl [''',''' inst_decl] ''')''' [''':''' type] block


