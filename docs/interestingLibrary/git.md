---
title: Git
date: 2019-05-17
categories: 
 - Library
tags: 
 - Git
 - tool
---

> Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.

## 写在前面
Git是目前世界上最先进的分布式版本控制系统
都9102年了，如果作为程序员的你，对git还不是很了解，那你就该抓紧了。

接下来我只会写部分常用到的git操作命令，如果想深入了解git，在文章的末尾附有廖雪峰老师的教程还有一篇我很喜欢的文章，都可以去看看。

## 常用命令
1. git 初始化
    对于初始化git项目来说，有两种不同的情况，将使用不同的初始化方法：
    
    第一种是本地建仓，远程仓库只是一个空的仓库时:
    ```
    //这个命令会帮助你在当前文件中新建一个本地的git仓库，目录中会出现一个`.git`文件。这时候你就可以使用git的其他操作命令了。
    $ git init
    
    //在远程建立一个空的仓库，会得到一串远程仓库的地址,接下来我们通过使用这个地址添加远程仓库
    git remote add origin git@github.com:XXX/XXX.git
    
    //使用 git remote -v 可以看到当前本地仓库关联的所有远程仓库
    $ git remote -v
 
    origin  git@github.com:XXX/XXX.git (fetch)
    origin  git@github.com:XXX/XXX.git (push)
    
    //接下来一步到位，因为后面会详细讲（注意：在没有添加SSH之前，push命令会要求你出入账号密码）
    $ git add -a
    $ git commit -m '第一次提交'
    $ git push  -u origin master
    
    ```
    
    第二种是远程仓库已经有内容，我们需要将代码拉取下来时：
    ``` 
    $ git clone git@github.com:XXX/XXX.git
    ```
    
2. 一些概念    
    在介绍下面的命令前，咱们得先弄明白 git 几个存放文件的地方的概念：工作区（Working Directory）、版本库【其中包含暂存区（stage）和其他内容，也可以理解为是本地仓库】和 远程仓库。
    
    * 工作区：也就是咱们平时编辑的文件的位置，在工作区，我们可以随意编辑其中的文件。
    
    * 暂存区：我们通过`git add`命令，可以将`工作区`中变动的文件添加到`暂存区`，但仅仅只是暂存，还没有影响版本库中的代码。
    
    * 版本库：我们通过`git commit` 命令，将`暂存区`所有的内容都提交到版本库的`当前分支`，如果没有做过对应分支设置，那么默认的，当前分支将会是`master`分支。
    
    * 远程仓库：这个很好理解，就是在远程服务器上给我们存放内容的仓库，我们一般通过`git push`命令，将本地版本库当前分支上的内容给`推送`到远程仓库。
    
    * 分支：有同学会对上的`分支`感到有疑惑，试想一下，在实际项目中，我有一个很好的ideal想要去做做看，但是我又不能影响开发的进度，怎么办？我可以分出来一条分支来做开发，相当于两条分支起点相同，但是它们发展方向却不一样。当然如果后面我发现，哎！我这个ideal还可以，可以加入到项目中，那么我只要做一下`分支的合并`即可。
    
3. git pull
   ``` 
   //从默认的远程仓库（origin）的默认分支（master）上，拉取代码
   $ git pull
   //也可以指定要去哪个远程仓库的哪个分支上拉取代码
   $ git pull <remote> <branch> 
   ```
   `git pull`实际上是两步操作合并为一步：
   
   1. 第一步我们得从`远程仓库`拉取最新的代码到`本地仓库`,这一步我们也可以用下面的命令来做：
        ``` 
         $ git fetch <remote>
       ```
   2. 第二步是将`本地仓库`当前分支和`远程仓库`对应的分支进行合并,这一步我们也可以用下面的命令来做：
        ``` 
        $ git merge <branch>
       ```
    我们可以认为`git pull = git fetch + git merge`,`git pull`在调用时会自动给`git fetch`和`git merge`指定的远程仓库名和分支名。
    
4. git add 和 git commit
    ``` 
    //添加所有改动过的内容到暂存区
    $ git add -a
    //这里在提交时最好附上'提交信息'，让你团队和你自己知道你提交的是什么东西
    $ git commit -m [message]
    ```
5. git push
    ``` 
    //上传本地指定分支到远程仓库
    $ git push [remote][branch]	
    //强行推送当前分支到远程仓库，即使有冲突(!!玩火操作，在多人协作项目中最好不要用，有被打死的风险)
    $ git push [remote] --force	
    //	推送所有分支到远程仓库
    $ git push [remote] --all
    ```
6. git branch
    git 的分支功能极其强大，可以做很多骚操作.
    
    ``` 
    //列出所有本地分支
    git branch
    //列出所有远程分支
    git branch -r
    //列出所有本地分支和远程分支
    git branch -a
    
    // 新建一个分支，但依然停留在当前分支
    git branch [branch-name]
    
    //新建一个分支，并切换到该分支
    git checkout -b [branch-name]
    
    //新建一个分支，与指定的远程分支建立追踪关系
    git branch --track [branch][remote-branch]
    
    //切换到指定分支，并更新工作区
    git checkout [branch-name]
    
    //删除分支
    git branch -d [branch-name]
    
    //删除远程分支
    git push origin --delete [branch-name]
    ```
    
7. git tag
    git中有打tag标记的功能，一般用于记录特定时间的提交点(commit)，项目中常用于给代码打上版本，用于以后有问题时回滚。
    ``` 
    //先切换到你想打tag的分支上
    $ git checkout master
    Switched to branch 'master'
    
    //下面的命令就成功打上了你命名的标记
    $ git tag <name>
    //如果是以前的代码需要打tag，可以使用对应的commit id 来打tag
    $ git log --pretty=oneline --abbrev-commit
    
    4c805e2 fix bug 101
    e1e9c68 merge with no-ff
    f52c633 add merge
    
    $ git tag v1.0.0 f52c633
    
    //查看所有tag
    $ git tag
    //查看指定tag
    $git show <tagname>
    
    //还可以带上个说明
    //下面命令是让git 在提交点 1094adb 打一个标签，标签名为v0.1,标签信息为"version 0.1 released"
    $ git tag -a v0.1 -m "version 0.1 released" 1094adb
    ```
8. 其他命令
    ```
    //显示有变更的文件 
    git status	
    //显示当前分支的版本历史
    git log	
    //显示暂存区和工作区的差异
    git diff	
    ```
## 参考链接
1. [廖雪峰-Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)
2. [一篇文章，教你学会Git](https://juejin.im/post/599e14875188251240632702)