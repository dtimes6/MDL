MDL
===

Modeling Description Language

Author: 代鹏
Email:  dtimes6@gmail.com

Modeling Description Language(MDL) is a general modeling description language, which is used to create model for other programming language or other description language. Such as C++/Java/Verilog/VHDL or even doing synthesis with library support.

No matter you are doing synthesis or doing compile, you are doing translation from one language into another. For C compiler you are translating C into ASM and from ASM into instructions. For Design Compiler you are translating Verilog into Netlist and from Netlist doing Placement&Routing and tape-out for Chip or program into FPGA.

What MDL brings ?

For hardware:

Easy to control. The tranditional synthiesis tool, the result is not desirble, it might choose the optimization method for you but which might not of what you are expecting. We want to show you a makefile tool that is fully under your control.

No matter Verilog nor VHDL cannot support today's requirements. There are mixed problems that are not native to the language itself such as debugging/cdc/power/ip-soc. And it is of stupid high cost to maintain all these problems.

Doing mix of hardware and software. You can either make a program or program a FPGA, its free to choose and might become more flexlibel. So new hardware might exist in furture with this support.

For software:

It is just a compiler which can translate from one language into another if library support exist.

Easy to do mixed language compile.

Easy to adapt new programming language.

===

The whole project is divded into 6 parts.

1. Object Model
2. Parser
3. Optimizer 
4. Compiler
5. Standard Library
6. Formal Tools

===
