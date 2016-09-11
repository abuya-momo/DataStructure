function createETree(){//创建二叉树
	this.root = null;
	this.insert = insertETreeNode;
	this.inOrder = traverseETree;
}
var etree = new createETree();

function insertETreeNode(n){//插入节点

	if(this.root == null){
		this.root = n;
	}
	else{
		var current = this.root;
		var parent;
		while(true){
			parent = current;
			if (n.offsetTop < current.offsetTop){
				current = current.left;
				if (current == null){
					parent.left = n;
					break;
				}
			}
			else{
				current = current.right;
				if (current == null){
					parent.right = n;
					break;
				}
			}
		}
	}
}

function searchETreeNode(offsetTop){//查找节点
	var current = this.root;

	var tempNode = new Array(2);
	var now = 0;
	//更改部分:记录上两个节点的值,如果current == null 则判断是否参数值夹在上两个值之间了,如果是,则返回第一个值.
	while(current != null){
		if(current.offsetTop == offsetTop){
			return current;
		}
		else if(offsetTop < current.offsetTop){
			if(now == 0){
				now = 1;
			}
			else{
				now = 0;
			}
			tempNode[now] = current;
			current = current.left;
		}
		else{
			if(now == 0){
				now = 1;
			}
			else{
				now = 0;
			}
			tempNode[now] = current;
			current = current.right;
		}
	}

	if(now == 0){
		var nowA = 1;
	}
	else{
		var nowA = 0;
	}
	if(offsetTop > tempNode[nowA] && offsetTop < tempNode[now]){
		return tempNode[now];
	}
	else if(offsetTop < tempNode[nowA] && offsetTop > tempNode[now]){
		return tempNode[nowA];
	}

}

function deleteETreeNode(){//删除节点

}

function traverseETree(node){//中序遍历二叉树,并将offsetTop属性加上
	if(!(node == null)){
		traverseETree(node.left);
		node.offsetTop = $('#s').find('[num='+ node.num +']').get(0).offsetTop;
		console.log(node.num + '  ' + node.offsetTop);
		traverseETree(node.right);
	}
}