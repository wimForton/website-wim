import CustomController from 'lil-gui/extras/CustomController.js';

export default class BezierController extends CustomController {

	$constructor() {

		const svgNS = 'http://www.w3.org/2000/svg';

		this.svg = document.createElementNS( svgNS, 'svg' );
		this.path = document.createElementNS( svgNS, 'path' );
		this.line1 = document.createElementNS( svgNS, 'line' );
		this.line2 = document.createElementNS( svgNS, 'line' );
		this.handle1 = document.createElementNS( svgNS, 'circle' );
		this.handle2 = document.createElementNS( svgNS, 'circle' );

		this.svg.setAttribute( 'viewBox', '0 0 1 1' );

		this.handle1.setAttribute( 'r', 0.05 );
		this.handle2.setAttribute( 'r', 0.05 );

		this.line1.setAttribute( 'x1', 0 );
		this.line1.setAttribute( 'y1', 0 );

		this.line2.setAttribute( 'x1', 1 );
		this.line2.setAttribute( 'y1', 1 );

		this.svg.append(
			this.line1,
			this.line2,
			this.path,
			this.handle1,
			this.handle2
		);

		this.$widget.appendChild( this.svg );

		this.makeDraggable( this.handle1, ( x, y ) => {

			this.$value[ 0 ] = x;
			this.$value[ 1 ] = y;
			this.$onChange();

		} );

		this.makeDraggable( this.handle2, ( x, y ) => {

			this.$value[ 2 ] = x;
			this.$value[ 3 ] = y;
			this.$onChange();

		} );

	}

	$updateDisplay() {

		const [ x1, y1, x2, y2 ] = this.$value;

		// Position the control point handles.
		this.handle1.setAttribute( 'cx', x1 );
		this.handle1.setAttribute( 'cy', y1 );

		this.handle2.setAttribute( 'cx', x2 );
		this.handle2.setAttribute( 'cy', y2 );

		// Update the lines that connect them to the corner.
		this.line1.setAttribute( 'x2', x1 );
		this.line1.setAttribute( 'y2', y1 );

		this.line2.setAttribute( 'x2', x2 );
		this.line2.setAttribute( 'y2', y2 );

		// Draw a bezier curve using the d attribute of the <path> element.
		this.path.setAttribute( 'd', `M 0 0 C ${x1} ${y1}, ${x2} ${y2}, 1 1` );

	}

	// todo
	$copy( a, b ) {
		a[ 0 ] = b[ 0 ];
		a[ 1 ] = b[ 1 ];
		a[ 2 ] = b[ 2 ];
		a[ 3 ] = b[ 3 ];
	}

	// todo
	$compare( a, b ) {
		for ( let i = 0; i < 3; i++ ) {
			if ( a[ i ] !== b[ i ] ) return false;
		}
		return true;
	}

	makeDraggable( handle, setter ) {

		const clamp = x => Math.min( Math.max( 0, x ), 1 );

		const inverseLerp = ( t, a, b ) => ( t - a ) / ( b - a );

		handle.addEventListener( 'mousedown', () => {
			window.addEventListener( 'mousemove', onMouseMove );
			window.addEventListener( 'mouseup', onMouseUp );
		} );

		const onMouseMove = e => {

			e.preventDefault();

			const rect = this.svg.getBoundingClientRect();

			const x = inverseLerp( e.clientX, rect.left, rect.right );
			const y = inverseLerp( e.clientY, rect.bottom, rect.top );

			// This lets either handle do something different with x and y.
			setter( clamp( x ), clamp( y ) );

		};

		const onMouseUp = () => {

			this.$onFinishChange();

			window.removeEventListener( 'mousemove', onMouseMove );
			window.removeEventListener( 'mouseup', onMouseUp );

		};

	}

}

// todo
BezierController.$id = 'Bezier';

// todo
BezierController.$style = `
.lil-gui .controller.Bezier svg {
	width: 100%;
	background-color: var(--widget-color);
	border-radius: var(--widget-border-radius);
	
	/* flip coordinates so that up is positive */
	transform: scaleY(-1);
}

.lil-gui .controller.Bezier svg * { 
	/* let us use a tiny viewbox without huge strokes */
	vector-effect: non-scaling-stroke;
}

.lil-gui .controller.Bezier path {
	stroke: var(--number-color);
	stroke-width: 2px;
	fill: none;
}

.lil-gui .controller.Bezier line {
	stroke: var(--focus-color);
	stroke-width: 1px;
}

.lil-gui .controller.Bezier circle {
	fill: var(--text-color);
	cursor: pointer;
}`;

CustomController.register( BezierController );