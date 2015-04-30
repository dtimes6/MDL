#MDL


#模型描述语言 综合工具源码

&copy;2015 Peng Dai, 保留所有权利。

作者: 代鹏

邮件: dtimes6@163.com

##开发及运行环境

开发语言：javascript

运行环境：  node
单元测试：  mocha
覆盖率测试：istanbul

##调试环境设置

调试设置：修改 MDL/Compiler/ErrorHandling/errorhandling.js 中的 ErrorHandling 的 debug 项为 true。

##测试与结果

在 MDL/Test/ 目录下运行 test.sh

覆盖率测试结果位于：
MDL/Test/coverage/lcov-report/index.html

##目录结构以及功能简述

    /- MDL
        |- Compiler             工具套件
        |    |- Parser          语法树生成
        |
        |- Library              标准程序库
        |- Test                 单元测试

##语法树节点描述
    parent  上一级节点
    type    节点类型
    childs  子节点 根据节点类型不同而不同
    value   【可常量】节点取值
    scope   【域】查询表格
    method  综合方法描述

##语法树结构描述

 >`statement` :＝
    `element_decl` ｜
    `process_decl` ｜
    `function_decl` ｜
    `operproc_decl` ｜
    `operation_decl` ｜
    `language` ｜
    `module_decl` ｜
    `template_decl` ｜
    `if` ｜
    `switch` ｜
    `while` ｜
    `do_while` ｜
    `for` ｜
    `for_in` ｜
    `return` ｜
    `break` ｜
    `continue` ｜
    `block` ｜
    `expr_stmt`
    __;__

>`element_decl` :＝ __element__ `identifier`

>`template_decl` :＝ __template__ __[__ ［ `template_parameter_decl` ［ __,__ `template_parameter_decl` ］］__]__ （`process_decl` ｜ `function_decl` ｜ `operproc_decl` ｜ `operation_decl` ｜ `module_decl`）

>`process_decl` :＝ __process__ `identifier` ［ `template_parameter` ］ __(__ ［ `inst_decl` ［ __,__ `inst_decl` ］］ __)__ ［ __:__ `type` ］ `block`

>`function_decl` :＝ __function__ `identifier` ［`template_parameter`］ __(__ ［ `inst_decl` ［ __,__ `inst_decl` ］］ __)__ ［ __:__ `type` ］ `block`

>`operproc_decl` :＝ __process__ `operator` ［ `template_parameter` ］ __(__ ［ `inst_decl` ［ __,__ `inst_decl` ］］ __)__ ［ __:__ `type` ］ `block`

>`operation_decl` :＝ __function__ `operator` ［ `template_parameter` ］ __(__ ［ `inst_decl` ［ __,__ `inst_decl` ］］ __)__ ［ __:__ `type` ］ `block`

>`module_decl` :＝ __module__ `identifier` ［ `template_parameter` ］ ［ __:__ `inheritance` ］ `block`

>`inheritance` :＝ `type` ［ __,__ `type` ］［ __(__ ［（ __(__ `type` ［ __,__ `type` ］ __)__ ｜ `type` ［ __,__ `type` ］）］ __)__ ］

>`template_parameter_decl` :＝ `typename_decl` | `inst_decl`

>`template_parameter` :＝ （ `type` ｜ `expr` ）［ __,__ （ `type` ｜ `expr` ）］

>`typename_decl` :＝ __typename__ ｜ __element__ ｜ __module__ `identifier`

>`language` :＝ __language__ `string` __(__ ［ `string` ［ __,__ `string` ］］ __)__ `block`

>`block` :＝ __{__ statement ［ statement ］__}__

>`inst_decl_assign` :＝ `type` `identifier` ［ __=__ `expr` ］

>`inst_decl` :＝ `type` `identifier`

>`if` :＝ __if__ __(__ `expr` __)__ （ `block` | `statement` ）［ __else__ （ `block` | `statement` ）］

>`switch` :＝ __switch__ __(__ `expr` __)__ __{__ ［ `case` ［ `case` ］］［ `default` ］ __}__

>`case` :＝ __case__ （ `string` ｜ `number` ）__:__ （ `block` | `statement` ）

>`default` :＝__default__ __:__（ `block` | `statement` ）

>`while` :＝__while__ __(__ `expr` __)__ ［ `tag` ］（ `block` | `statement` ）

>`do_while` :＝ __do__ （ `block` | `statement` ）__while__ __(__ `expr` __)__ ［ `tag` ］__;__

>`for` :＝ __for__ __(__ （ `inst_decl_assign` ｜ `expr` __;__ `expr` __;__ `expr`  ） __)__ ［ `tag` ］（ `block` | `statement` ）

>`for_in` :＝ __for__ __(__ （ `inst_decl_assign` ｜ `expr` ）__in__ `expr` __)__ ［ `tag` ］（ `block` | `statement` ）

>`tag` :＝ __:__ `identifier`

>`return` :＝ __return__ ［ `expr` ］ __;__

>`break` :＝ __break__ ［ `identifier` ］__;__

>`continue` :＝ __continue__ ［ `identifier` ］__;__

>`expr_stmt` :＝ ［ `expr` ］ __;__

>`type` :＝ `identifier`［ `template_parameter` ］［ __::__ `identifier`［ `template_parameter` ］ ］［ __[__ `expr` __]__ ［ __[__ `expr` __]__ ］］

>`expr` :＝ ［`op`］（__(__ `expr` __)__｜ `func_call`｜ `index` ｜ `member` ｜ `identifier` ｜ `number` ｜ `string` ）［`op` ［（__(__ `expr` __)__｜ `func_call`｜ `index` ｜ `member` ｜ `identifier` ｜ `number` ｜ `string` ）］］

>`func_call` :＝ `expr`［ `template_parameter` ］__(__ `expr` __)__

>`index` :＝ `expr` __[__ `expr` __]__

>`member` :＝ `expr` __.__ `expr`