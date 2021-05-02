export default class PriorityQueue<T> {
    queue:T[] = [];
    comparator:Function = () => {}

    constructor (comparator:(e1:T, e2:T) => T) {
        this.comparator = comparator;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    enqueue(element:T) {
       if(this.isEmpty()) {
           this.queue.push(element);
       } else {
           let added = false;
           for(let i = 0;i < this.queue.length; i++) {
               if(this.comparator(this.queue[i], element) === element) {
                   this.queue = [...this.queue.slice(0, i), element, ...this.queue.slice(i)];
                   added = true;
                   break;
               }
           }
           if(!added)
            this.queue.push(element);
       }
    }

    front():T {
        return this.queue[0];
    }

    back() {
        return this.queue[this.size()-1];
    }

    dequeue() {
        this.queue = this.queue.slice(1);
    }

    size():number {
        return this.queue.length;
    }

    print() {
        for(const el of this.queue) {
            console.log(el);
        }
    }

}