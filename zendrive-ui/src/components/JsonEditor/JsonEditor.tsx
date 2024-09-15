// import { useEffect, useRef } from "react";
// import JSONEditor from "jsoneditor";

// import "jsoneditor/dist/jsoneditor.css";
// import "./JSONEditor.css";

// const JSONEditor = ({ json, onChangeJSON }) => {
// 	const editorRef = useRef(null);
// 	const containerRef = useRef(null);

// 	useEffect(() => {
// 		const options = {
// 			mode: "tree",
// 			onChangeJSON
// 		};

// 		editorRef.current = new JSONEditor(containerRef.current, options);
// 		editorRef.current.set(json);

// 		return () => {
// 			if (editorRef.current) {
// 				editorRef.current.destroy();
// 			}
// 		};
// 	}, [onChangeJSON]);

// 	useEffect(() => {
// 		if (editorRef.current) {
// 			editorRef.current.update(json);
// 		}
// 	}, [json]);

// 	return <div className="jsoneditor-react-container" ref={containerRef} />;
// };
