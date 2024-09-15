import { RefObject, useEffect } from "react";

export function useClickawayListener(
	ref: RefObject<HTMLElement>,
	handler: (event?: MouseEvent) => any
) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler(event);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}
