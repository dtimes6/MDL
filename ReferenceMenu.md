Model Description Language Reference Menu
=========================================
模型描述语言参考手册
=================

&copy; 代鹏，保留所有权利。

序言
====
模型描述语言（MDL）是一种为解决大型工程化和模块化设计中出现的各种问题而引入的通用的铺助建模语言。
目的是为了在工程化个个模块的同时引入不同的方面的支持（比如说仿真，工程化描述，验证描述等等），

传统的设计思路存在的问题是各种语言互不相通难以做到模块化和工程化，模块复用难度巨大。大多数时间人们
只是完成机械的重复性劳动，难以构建出更大更为复杂的模块。复杂度太高以后，工程问题难以收敛没法得到有
效的解。仿真系统各个层次独立互不相关，难以做到系统级别的有效验证和开发。

MDL诞生正是为了解决这一系列的问题而出发的。

MDL的一些基本概念：

支持通过简单的library支持兼容编译到多种语言框架。

    在一个 function 定义中可以引入不同的语言以及有效约束的language段，在综合过程中可以根据需要进行分化

支持泛型编程可以有效的通过推导方式构建模型。（大模块总是由小模块组成的）。
支持最小化生成（使用才生成）可以剔除系统冗余。

    例如：

    element voltage;
    element current;
    element resistance;

    function element_decl_voltage(original name) : synth {
        lanaguage 'C' ('simulation') {
            original id = singletonSymbol(name);
            synth ret = "double @id";
            return ret;
        }
    }

    function element_decl_current(original name) : synth {
        lanaguage 'C' ('simulation') {
            original id = singletonSymbol(name);
            synth ret = "double @id";
            return ret;
        }
    }

    function element_decl_resistance(original name) : synth {
        lanaguage 'C' ('simulation') {
            original id = singletonSymbol(name);
            synth ret = "double @id";
            return ret;
        }
    }

    function element_convert_number_to_resistance(original value) : synth {
        lanaguage 'C' ('simulation') {
            synth ret = "1.0 * @value";
            return ret;
        }
    }

    module Resistor {
        resistance r;

        function Resistor (resistance r) {
            this.r = r;
        }

        process voltage(current i) : voltage {
            return i * r;
        }
    };

    process "$0*$1" (current i, resistance r) : voltage {
        lanaguage 'C' ("check-current") {
            synth ret = "assert(@i < MagicNumber), ";
            return ret;
        }
        lanaguage 'C' ("simulation") {
            synth ret = "@i * @r";
            return ret;
        }

    }

    process "$1*$0" (resistance r, current i) : voltage {
        return i * r;
    }

    Resistor r = Resistor(100);
    current i;
    voltage v = r.voltage(i);

    /// 指定‘C'语言 做仿真并且做电流检查优化并最终生成如下代码

    double r_r;
    r_r = 1.0 * 100;

    double i;

    double v = assert(i < MagicNumber), i * r_r;

词法
====

分隔符 space
------------

    空格符  ‘ ’
    制表符  ‘\t‘
    换行符  ’\n‘
    语句分隔符 ’;‘

    [ \t\n]

注释 comment
------------

    //  行注释 只能是一行

    /*
        块注释 可以是多行的
    */

标识符 identifier
-----------------
以字母和下划线开头，后由字母数字下划线组成的字符序列被识别为标识符

    ^[A-Za-z_][A-Za-z0-9_]*

数字 number
-----------

#### 十进制整数
可以是0d开头，以0到9的数字组成的字符序列。

    (0d)?[0-9]+

#### 二进制整数
以0b开头后由0或者1组成的字符序列。

    0b[01]+

#### 八进制整数
以0o开头后由0到7的数字组成的字符序列。

    0o[0-7]+

#### 十六进制整数
以0h或者0x开头后由0到9的数字A到F或者a到f的字母组成的字符序列。

    0[hx][0-9A-Fa-f]+

#### 浮点数
可以是以0到9的数字组成的字符序列开头的，后接小数点‘.’，后由0到9的数字组成的字符序列。

    [0-9]*\.[0-9]+

字符串 string
------------
以’"‘开头并以’"‘结束，且不是以’\"‘结束的字符序列。或者以’'‘开头并以’'‘结束，且不是以’\'‘结束的字符序列。或者以’"""‘开头并以’"""‘结束的字符序列。

    "([^"](\")?)*"
    '([^'](\')?)*'

    """多行字符串"""

符号 operator
-------------
####内建固定切割类型符号
    不可用于操作符
    ;
    {}
    []
    ()

####自定义符号
非空白字符数字字母括号以及下划线组成的字符序列。

    [^ \t\nA-Za-z0-9_;"\(\)\[\]\{\}']+

语句
====

常量 constant
-------------

####字符串
####数值
####标识符

函数 function
-------------
函数的定义和重载规则如下

    function 函数名称 ( 参数列表 ) : 返回类型 {
        语句块
    }

一个函数必须以关键字 function 开始，然后紧跟函数名，然后是括号以及其中的参数列表。如果函数具备返回类型则需要在‘:’后面加上返回类型。
最后在一对大括号内给出函数‘执行’的语句块。

由于MDL的整个综合过程就是函数的嵌套调用。所以整个静态分析器会对函数的调用关系做详细的把关配合以调用合适的连接模块。参见最后一章的智能化链接器。

    function method_buildin_identifier (original s) : synth {
        static buildin::map symbol_mapping;
        original o;
        if (symbol_mapping.has(s)) {
            o = symbol_mapping.get(s);
        } else {
            o = s.replace('_','__')
                 .replace('.','_dot_');
            symbol_mapping.set(s, o)
        }

        return "@o";
    }

    以上函数调用重载了标识符的编译方法

类型 type
---------
####源类型 original
所有的常量类型都是源类型。源类型是为了个性化综合引入的基本类型。在MDL中所有的语句以及表达式源类型都可以参与个性化综合。通过重载个性化综合函数可以很容易改写并控制综合行为。

####生成类型 synth
####基础类型 element
####模块类型 module

控制语句 control statement
-------------------------

#### 条件语句

###### if else
###### switch case
#### 循环语句
###### for in
###### for
###### do while
###### while

综合语句 synthesis statement
---------------------------

    synth code = """
        /*
         * This is code example for C compilers
         */
        char* constant_@name = @str;
    """;

函数 function
-------------
进程 process
------------
操作符 operator
--------------

    function "函数操作描述字符串" ( 参数列表 ) : 返回类型 {
        语句块
    }

语言支持 language
----------------

    language "语言名称" ( 修饰符列表 ) {
        语句块
    }

模块 module
-----------

    module 模块名称 : 继承列表 {
        类型
        成员变量
        成员函数
        重载操作
        重载访问
    }

####继承

    默认虚拟继承,
    继承模式分割

    A0
    B0
    C0

    A1 : A0,C0
    B1 : A0,B0
    C1 : B0,C0

    //指定虚拟继承模式
    // 具体指定模式
    A2 : A1,B1(A1.A0,B1.A0)
    B2 : A1,B1,C1(A1.A0,B1.A0,B1.B0,C1.B0)
    // 精简指定模式
    C2 : A1,B1,C1(A0,B0)
    // 非虚拟继承指定模式
    D2 : A1,B1,C1(~C0)

泛型支持 template
----------------
####泛型模块
####泛型函数
####泛型操作

综合及代码生成
============

    使用则综合，不使用不综合

####实例化

代码组织与优化
============
####泛型优化
####语言级别优化

内建语义支持
==========

    内建类型为代码综合提供基础支持，例如标识符管理，不可直接综合。

####基本运算
####内建类型
######array
######set
######map
####智能化链接分析器
######扇入扇出分析
######嵌套综合分析
######等效分析

