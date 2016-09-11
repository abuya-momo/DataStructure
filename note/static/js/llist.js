function Node(indexOfPara, offsetTop) {
    this.indexOfPara = indexOfPara;
    this.offsetTop = offsetTop;
    this.next = null;
    this.previous = null;
}

function LList() {
    this.head = null;
    this.find = find;
    this.insertL = insertL;
    this.insertF = insertF;
    this.display = display;
    this.remove = remove;
    this.findLast = findLast;
    this.findIndex = findIndex;
    this.findFromHead = findFromHead;
    this.findOnward = findOnward;
    this.findBackward = findBackward;
}

function findLast() {
    var currNode = this.head;
    while (! (currNode.next == null)) {
        currNode = currNode.next;
    }
    return currNode;
}

function remove(item) {
    var currNode = this.find(item);
    if (! (currNode.next == null)) {
        currNode.previous.next = currNode.next;
        currNode.next.previous = currNode.previous;
        currNode.next = null;
        currNode.previous = null;
    }
}

function display() {//遍历输出链表
    var currNode = this.head;
    while (! (currNode.next == null)) {
        console.log(currNode.next.indexOfPara);
        currNode = currNode.next;
    }
}

function find(item, nowNode) { //从nowNode开始向下寻找,找indexOfPara==item的
    if (nowNode != null) {
        var currNode = nowNode
    } else {
        var currNode = this.head;
    }

    while (currNode.indexOfPara != item) {
        currNode = currNode.next;
    }
    return currNode;
}

function findIndex(item) { //从nowNode开始向下寻找,找indexOfPara==item区间的
    var currNode = this.head;

    var q = new Queue(); //队首为旧的，队尾为新的
    q.enqueue(0);
    q.enqueue(0);
    var i = 0;

    while (currNode.indexOfPara != item) {
        q.dequeue();
        q.enqueue(currNode.indexOfPara);
        if (item >= q.first() && item <= q.end()) {//队头<item<队尾
            return currNode.previous;
        }
        currNode = currNode.next;
    }
    return currNode;
}

function findFromHead(now) { //从head开始向下寻找offsetTop,在findOnward与findBackward找不到的情况下用
    var currNode = llist.head;//遍历赋值offsetTop

    var q = new Queue(); //队首为旧的，队尾为新的
    q.enqueue(0);
    q.enqueue(0);
    var i = 0;

    while (!(currNode == null)) {
        q.dequeue();
        q.enqueue(currNode.offsetTop);
        if (now >= q.first() && now <= q.end()) {//队头<now<队尾
            return currNode;
        }
        else if(now <= q.first() && now >= q.end()){
            return currNode;
        }
        currNode = currNode.next;
    }
    return currNode;
}

function findOnward(now, nowNode) { //从nowNode开始向下寻找,找的是offsetTop,now是s的offsetTop
    if (nowNode != null) {
        var currNode = nowNode
    } else {
        var currNode = this.head;
    }

    var q = new Queue(); //队首为旧的，队尾为新的
    q.enqueue(now);
    q.enqueue(now);

    while (currNode.offsetTop != now) {
        q.dequeue();
        q.enqueue(currNode.offsetTop);

        if (now >= q.first() && now <= q.end()) {//队头<now<队尾
            return currNode;
        }

        if(currNode.next == null || currNode.next == undefined){
            console.log('not find');
            break;
        }
        currNode = currNode.next;
    }
    return this.findFromHead(now);
}

function findBackward(item, nowNode) { //从nowNode开始向前寻找
    var currNode;
    if (nowNode != null) {
        currNode = nowNode
    } else {
        currNode = this.findLast();
    }

    var q = new Queue(); //队首为旧的，队尾为新的
    q.enqueue(item);
    q.enqueue(item);

    while (currNode.indexOfPara != item) {
        q.dequeue();
        q.enqueue(currNode.offsetTop);

        if (item <= q.first() && item >= q.end()) {
            return currNode;
        }
        if(currNode.previous == null || currNode.previous == undefined){
            console.log('not find');
            break;
        }
        currNode = currNode.previous;
    }
    return this.findFromHead(item);
}

function insertL(n) {//尾插法
    if (this.head == null) {
        this.head = n;
    } else {
        var newNode = n;
        var current = this.findLast();
        newNode.next = current.next;
        newNode.previous = current;
        current.next = newNode;
    }

}

function insertF(n) {//头插法
    if (this.head == null) {
        this.head = n;
    } else {
        var newNode = n;
        var current = this.head;
        newNode.next = this.head;
        newNode.previous = null;
        current.previous = newNode;
        this.head = newNode;
    }
}