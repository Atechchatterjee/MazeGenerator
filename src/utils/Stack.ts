export default class Stack<T> {
	stack = new Array<T>();

	peek():T {
		return this.stack[this.stack.length-1];
	}

	pop():T {
		const el = this.stack[this.stack.length-1];	
		this.stack.shift();
		return el;
	}

	push(el:T) {
		this.stack.push(el);
	}

	size() {
		return this.stack.length;
	}

	isEmpty():boolean {
		return this.stack.length <= 0;
	}

}