// @vitest-environment jsdom

import { expect, test } from 'vitest';
import { BlazeLinkedList } from './linked-list.svelte';

test('linked list create', () => {
	const list = new BlazeLinkedList<string>();
	expect(list.first).toBe(undefined);
	expect(list.frontBuffer).toEqual([]);
});

test('linked list add item', () => {
	const list = new BlazeLinkedList<string>();
	list.push('a');
	expect(list.first).toBe('a');
	expect(list.frontBuffer).toEqual(['a']);
});

test('linked list add many items', () => {
	const list = new BlazeLinkedList<string>(3);
	list.push('a');
	list.push('b');
	list.push('c');
	list.push('d');
	list.push('e');
	expect(list.first).toBe('a');
	expect(list.frontBuffer).toEqual(['a', 'b', 'c']);
});

test('linked list remove item', () => {
	const list = new BlazeLinkedList<string>(3);
	list.push('a');
	list.push('b');
	list.push('c');
	list.push('d');
	list.push('e');
	list.removeFirst();
	expect(list.first).toBe('b');
	expect(list.frontBuffer).toEqual(['b', 'c', 'd']);
});
