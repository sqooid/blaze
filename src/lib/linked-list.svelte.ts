type BlazeLinkedListNode<T> = {
	value: T;
	next: BlazeLinkedListNode<T> | null;
};

export class BlazeLinkedList<T> {
	#head: BlazeLinkedListNode<T> | null = $state(null);
	#tail: BlazeLinkedListNode<T> | null = $state(null);
	#size = $state(0);

	#bufferSize = $state(0);
	#frontBuffer = $derived.by(() => {
		let buffer: T[] = [];
		let node = this.#head;
		while (node !== null) {
			buffer.push(node.value);
			node = node.next;
			if (buffer.length >= this.#bufferSize) {
				break;
			}
		}
		return buffer;
	});

	constructor(bufferSize = 0) {
		this.#bufferSize = bufferSize;
	}

	get first() {
		return this.#head?.value;
	}

	get frontBuffer() {
		return this.#frontBuffer;
	}

	get size() {
		return this.#size;
	}

	push(value: T) {
		if (this.#head === null) {
			this.#head = { value, next: null };
			this.#tail = this.#head;
		} else if (this.#tail !== null) {
			this.#tail.next = { value, next: null };
			this.#tail = this.#tail.next;
		}
		this.#size += 1;
	}

	removeFirst() {
		if (this.#head !== null) {
			this.#head = this.#head.next;
			this.#size -= 1;
		}
	}

	clear() {
		this.#head = null;
		this.#tail = null;
		this.#size = 0;
	}
}
