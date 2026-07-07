const DEFAULT_PRINT_WINDOW_FEATURES = 'width=1024,height=768';
const DEFAULT_STICKY_SELECTOR = '.form-top-sticky, .form-bottom-sticky';

const normalizeStickyNodes = (root, selector) => {
	const stickyNodes = root.querySelectorAll(selector);

	stickyNodes.forEach(node => {
		node.style.position = 'static';
		node.style.top = 'auto';
		node.style.bottom = 'auto';
		node.style.margin = '0';
	});
};

const getStyleTags = () =>
	Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
		.map(node => node.outerHTML)
		.join('');

const createPrintHtml = (content, title, styleTags) => `
	<!doctype html>
	<html lang="zh-Hant">
		<head>
			<meta charset="UTF-8">
			<title>${title}</title>
			${styleTags}
			<style>
				body {
					margin: 0;
					padding: 16px;
					background: #fff;
				}
				.form-top-sticky {
					position: static !important;
					top: auto !important;
					bottom: auto !important;
					margin: 0 !important;
				}
				.form-bottom-sticky {
					display: none !important;
				}
			</style>
		</head>
		<body>
			${content}
		</body>
	</html>
`;

const waitForLoad = printWindow =>
	new Promise(resolve => {
		printWindow.onload = () => resolve();
	});

export const printElement = async (
	target,
	{
		title = 'print-document',
		windowFeatures = DEFAULT_PRINT_WINDOW_FEATURES,
		stickySelector = DEFAULT_STICKY_SELECTOR
	} = {}
) => {
	if(!target)
		throw new Error('找不到可匯出的表單內容');

	const printWindow = window.open('', '_blank', windowFeatures);

	if(!printWindow)
		throw new Error('瀏覽器封鎖了列印視窗，請允許彈出視窗後再試一次');

	const clonedTarget = target.cloneNode(true);
	const styleTags = getStyleTags();

	normalizeStickyNodes(clonedTarget, stickySelector);

	printWindow.document.open();
	printWindow.document.write(createPrintHtml(clonedTarget.outerHTML, title, styleTags));
	printWindow.document.close();

	try {
		await waitForLoad(printWindow);
		await new Promise(resolve => {
			setTimeout(() => {
				printWindow.focus();
				printWindow.print();
				setTimeout(() => {
					printWindow.close();
					resolve();
				}, 300);
			}, 300);
		});
	}
	catch(err) {
		printWindow.close();
		throw err;
	}
};

