import {
    AbstractCanvas2D,
    CellRenderer,
    type ColorValue,
    Rectangle,
    ActorShape,
    SvgCanvas2D,
} from '@maxgraph/core';

export function registerCustomShapes(): void {
    console.info('Registering custom shapes...');
    // @ts-ignore TODO fix CellRenderer. Calls to this function are also marked as 'ts-ignore' in CellRenderer
    CellRenderer.registerShape('dataStore', DataStoreShape);
    // @ts-ignore
    CellRenderer.registerShape('gatewayParallel', GatewayParallelShape);
    // @ts-ignore
    CellRenderer.registerShape('gatewayXor', GatewayXorShape);
    // @ts-ignore
    CellRenderer.registerShape('service', ServiceShape);
    // @ts-ignore
    CellRenderer.registerShape('startEventMessage', StartEventMessageShape);
    console.info('Custom shapes registered');
}
class GatewayParallelShape extends ActorShape {

    constructor() {
        super();
    }

    override redrawPath(path: SvgCanvas2D, x: number, y: number, w: number, h: number) {
        path.begin();
        path.moveTo(24.188, 0);
        path.curveTo(23.686, 0, 23.185, 0.186, 22.812, 0.56);
        path.lineTo(0.744, 22.628);
        path.curveTo(0, 23.372, 0.003, 24.635, 0.747, 25.379);
        path.lineTo(22.812, 47.444);
        path.curveTo(23.556, 48.188, 24.818, 48.191, 25.563, 47.444);
        path.lineTo(47.631, 25.375);
        path.curveTo(48.375, 24.631, 48.372, 23.369, 47.627, 22.625);
        path.lineTo(25.563, 0.56);
        path.curveTo(25.191, 0.188, 24.689, 0.001, 24.188, 0);
        path.close();
        path.moveTo(24.186, 3.272);
        path.lineTo(44.918, 24.005);
        path.lineTo(24.186, 44.738);
        path.lineTo(3.453, 24.005);
        path.close();
        path.moveTo(23.62, 11.834);
        path.curveTo(23.62, 11.835, 23.369, 11.882, 23.369, 11.882);
        path.curveTo(23.369, 11.882, 23.164, 12.02, 23.163, 12.02);
        path.curveTo(23.163, 12.021, 23.021, 12.231, 23.021, 12.231);
        path.curveTo(23.021, 12.231, 22.972, 12.482, 22.972, 12.482);
        path.lineTo(22.972, 22.784);
        path.lineTo(12.666, 22.784);
        path.lineTo(12.664, 22.782);
        path.curveTo(12.664, 22.783, 12.414, 22.838, 12.414, 22.838);
        path.curveTo(12.414, 22.838, 12.209, 22.976, 12.209, 22.976);
        path.lineTo(12.209, 22.973);
        path.curveTo(12.208, 22.973, 12.066, 23.184, 12.066, 23.184);
        path.curveTo(12.066, 23.184, 12.018, 23.435, 12.018, 23.435);
        path.lineTo(12.018, 24.564);
        path.curveTo(12.018, 24.564, 12.066, 24.817, 12.067, 24.819);
        path.curveTo(12.067, 24.819, 12.209, 25.025, 12.209, 25.025);
        path.curveTo(12.21, 25.025, 12.416, 25.163, 12.416, 25.163);
        path.curveTo(12.416, 25.164, 12.667, 25.219, 12.667, 25.219);
        path.lineTo(22.972, 25.219);
        path.lineTo(22.972, 35.519);
        path.lineTo(22.97, 35.517);
        path.curveTo(22.97, 35.517, 23.02, 35.773, 23.02, 35.773);
        path.curveTo(23.02, 35.773, 23.162, 35.978, 23.162, 35.978);
        path.curveTo(23.162, 35.979, 23.369, 36.117, 23.369, 36.117);
        path.curveTo(23.369, 36.117, 23.618, 36.169, 23.619, 36.172);
        path.lineTo(24.748, 36.172);
        path.curveTo(24.748, 36.172, 25.003, 36.119, 25.003, 36.119);
        path.curveTo(25.003, 36.119, 25.209, 35.981, 25.209, 35.981);
        path.curveTo(25.209, 35.981, 25.351, 35.775, 25.351, 35.775);
        path.curveTo(25.351, 35.775, 25.4, 35.52, 25.4, 35.52);
        path.lineTo(25.4, 25.219);
        path.lineTo(35.703, 25.219);
        path.curveTo(35.703, 25.219, 35.958, 25.166, 35.959, 25.166);
        path.curveTo(35.959, 25.166, 36.164, 25.028, 36.164, 25.028);
        path.curveTo(36.164, 25.028, 36.306, 24.822, 36.306, 24.822);
        path.curveTo(36.306, 24.822, 36.355, 24.567, 36.355, 24.567);
        path.lineTo(36.355, 23.439);
        path.curveTo(36.355, 23.439, 36.307, 23.191, 36.307, 23.188);
        path.curveTo(36.306, 23.188, 36.165, 22.977, 36.163, 22.977);
        path.curveTo(36.163, 22.977, 35.957, 22.839, 35.957, 22.839);
        path.curveTo(35.957, 22.839, 35.702, 22.784, 35.702, 22.786);
        path.lineTo(25.4, 22.786);
        path.lineTo(25.4, 12.484);
        path.curveTo(25.4, 12.484, 25.351, 12.236, 25.351, 12.233);
        path.curveTo(25.351, 12.233, 25.21, 12.022, 25.21, 12.022);
        path.curveTo(25.21, 12.022, 25.003, 11.884, 25.003, 11.884);
        path.curveTo(25.003, 11.884, 24.748, 11.834, 24.748, 11.834);
        path.close();
        path.fillAndStroke();
        super.redrawPath(path, x, y, w, h);
    }


}

class GatewayXorShape extends ActorShape {
    constructor() {
        super();
    }

    override  redrawPath(path: SvgCanvas2D, x: number, y: number, w: number, h: number) {
        path.begin();
        path.moveTo(24.188, 0);
        path.curveTo(23.686, 0, 23.185, 0.186, 22.812, 0.56);
        path.lineTo(0.744, 22.628);
        path.curveTo(0, 23.372, 0.003, 24.635, 0.747, 25.379);
        path.lineTo(22.812, 47.444);
        path.curveTo(23.556, 48.188, 24.818, 48.191, 25.563, 47.444);
        path.lineTo(47.631, 25.375);
        path.curveTo(48.375, 24.631, 48.372, 23.369, 47.627, 22.625);
        path.lineTo(25.563, 0.56);
        path.curveTo(25.191, 0.188, 24.689, 0.001, 24.188, 0);
        path.close();
        path.moveTo(24.186, 3.272);
        path.lineTo(44.918, 24.005);
        path.lineTo(24.186, 44.738);
        path.lineTo(3.453, 24.005);
        path.close();
        path.moveTo(16.443, 14.808);
        path.curveTo(16.442, 14.809, 16.193, 14.856, 16.193, 14.856);
        path.curveTo(16.193, 14.856, 15.982, 14.999, 15.982, 14.999);
        path.lineTo(15.184, 15.797);
        path.curveTo(15.183, 15.797, 15.038, 16.011, 15.038, 16.013);
        path.curveTo(15.038, 16.014, 14.993, 16.259, 14.993, 16.259);
        path.curveTo(14.993, 16.26, 15.041, 16.503, 15.041, 16.503);
        path.curveTo(15.041, 16.503, 15.18, 16.719, 15.18, 16.719);
        path.lineTo(22.467, 24.006);
        path.lineTo(15.184, 31.289);
        path.lineTo(15.184, 31.287);
        path.curveTo(15.184, 31.288, 15.038, 31.503, 15.038, 31.503);
        path.curveTo(15.038, 31.504, 14.993, 31.75, 14.993, 31.75);
        path.curveTo(14.993, 31.75, 15.041, 31.993, 15.042, 31.993);
        path.curveTo(15.042, 31.993, 15.18, 32.207, 15.18, 32.209);
        path.lineTo(15.978, 33.007);
        path.curveTo(15.978, 33.007, 16.196, 33.15, 16.197, 33.15);
        path.curveTo(16.197, 33.15, 16.439, 33.198, 16.439, 33.198);
        path.curveTo(16.44, 33.198, 16.685, 33.153, 16.686, 33.153);
        path.curveTo(16.686, 33.153, 16.901, 33.007, 16.901, 33.007);
        path.lineTo(24.184, 25.723);
        path.lineTo(31.469, 33.008);
        path.curveTo(31.47, 33.009, 31.688, 33.152, 31.688, 33.152);
        path.curveTo(31.688, 33.152, 31.931, 33.199, 31.931, 33.199);
        path.curveTo(31.931, 33.199, 32.177, 33.154, 32.177, 33.154);
        path.curveTo(32.177, 33.154, 32.392, 33.008, 32.392, 33.008);
        path.lineTo(33.19, 32.211);
        path.curveTo(33.19, 32.21, 33.332, 32, 33.332, 32);
        path.curveTo(33.332, 31.999, 33.381, 31.751, 33.381, 31.748);
        path.curveTo(33.381, 31.748, 33.332, 31.505, 33.332, 31.505);
        path.curveTo(33.332, 31.505, 33.19, 31.286, 33.19, 31.286);
        path.lineTo(25.906, 24.002);
        path.lineTo(33.19, 16.718);
        path.curveTo(33.19, 16.718, 33.332, 16.507, 33.332, 16.507);
        path.curveTo(33.332, 16.506, 33.381, 16.258, 33.381, 16.258);
        path.curveTo(33.381, 16.257, 33.332, 16.014, 33.332, 16.014);
        path.curveTo(33.332, 16.014, 33.187, 15.798, 33.187, 15.798);
        path.lineTo(32.389, 15);
        path.curveTo(32.389, 15, 32.177, 14.857, 32.177, 14.857);
        path.curveTo(32.177, 14.857, 31.935, 14.809, 31.934, 14.809);
        path.curveTo(31.934, 14.809, 31.685, 14.857, 31.685, 14.857);
        path.curveTo(31.684, 14.857, 31.473, 15, 31.473, 15);
        path.lineTo(24.189, 22.285);
        path.lineTo(16.901, 14.997);
        path.lineTo(16.901, 14.995);
        path.curveTo(16.9, 14.995, 16.686, 14.857, 16.686, 14.857);
        path.curveTo(16.685, 14.857, 16.443, 14.809, 16.443, 14.809);
        path.close();
        path.fillAndStroke();
        super.redrawPath(path, x, y, w, h);
    }


}

class ServiceShape extends ActorShape {
    constructor() {
        super();
    }

    override  redrawPath(path: SvgCanvas2D, x: number, y: number, w: number, h: number) {
        path.begin();
        path.moveTo(15.625, 0);
        path.curveTo(15.623, 1.502, 15.626, 3.005, 15.629, 4.507);
        path.curveTo(14.348, 4.87, 13.177, 5.375, 12.072, 5.995);
        path.lineTo(8.84, 2.802);
        path.lineTo(2.798, 8.88);
        path.lineTo(6.029, 12.072);
        path.curveTo(5.405, 13.191, 4.917, 14.38, 4.577, 15.614);
        path.lineTo(0, 15.622);
        path.lineTo(0, 24.182);
        path.lineTo(4.625, 24.165);
        path.curveTo(5.048, 25.842, 5.968, 27.349, 6.885, 28.697);
        path.lineTo(6.885, 21.314);
        path.lineTo(2.842, 21.329);
        path.lineTo(2.842, 18.46);
        path.lineTo(6.865, 18.453);
        path.lineTo(7.091, 17.309);
        path.curveTo(7.42, 15.64, 8.072, 14.05, 9.009, 12.627);
        path.lineTo(9.65, 11.654);
        path.lineTo(6.824, 8.862);
        path.lineTo(8.858, 6.816);
        path.lineTo(11.689, 9.613);
        path.lineTo(12.653, 8.97);
        path.curveTo(14.126, 7.999, 15.736, 7.347, 17.342, 7.008);
        path.lineTo(18.477, 6.772);
        path.lineTo(18.467, 2.842);
        path.lineTo(21.39, 2.842);
        path.lineTo(21.367, 6.752);
        path.lineTo(22.521, 6.752);
        path.lineTo(29.035, 6.752);
        path.curveTo(28.315, 5.893, 25.335, 4.776, 24.223, 4.465);
        path.lineTo(24.248, 0);
        path.curveTo(21.065, 0, 18.569, 0, 15.625, 0);
        path.close();
        path.moveTo(23.712, 8.189);
        path.lineTo(23.724, 12.695);
        path.curveTo(22.442, 13.058, 21.272, 13.564, 20.166, 14.183);
        path.lineTo(16.934, 10.991);
        path.lineTo(10.892, 17.068);
        path.lineTo(14.123, 20.26);
        path.curveTo(13.499, 21.379, 13.012, 22.568, 12.672, 23.803);
        path.lineTo(8.094, 23.811);
        path.lineTo(8.094, 32.37);
        path.lineTo(12.719, 32.353);
        path.curveTo(13.083, 33.623, 13.588, 34.782, 14.207, 35.876);
        path.lineTo(10.898, 39.172);
        path.lineTo(17.007, 45.177);
        path.lineTo(20.304, 41.895);
        path.curveTo(21.434, 42.522, 22.634, 43.009, 23.879, 43.348);
        path.lineTo(23.881, 48.006);
        path.curveTo(26.821, 48.031, 29.95, 48.018, 32.462, 48.018);
        path.lineTo(32.462, 43.305);
        path.curveTo(33.745, 42.943, 34.919, 42.434, 36.025, 41.814);
        path.lineTo(39.32, 45.063);
        path.lineTo(45.366, 38.993);
        path.lineTo(42.064, 35.739);
        path.curveTo(42.69, 34.618, 43.178, 33.427, 43.518, 32.191);
        path.lineTo(48, 32.163);
        path.lineTo(48, 23.612);
        path.lineTo(43.468, 23.639);
        path.curveTo(43.104, 22.369, 42.606, 21.218, 41.979, 20.116);
        path.lineTo(45.111, 16.977);
        path.lineTo(39.005, 10.962);
        path.lineTo(35.877, 14.1);
        path.curveTo(34.752, 13.478, 33.557, 12.992, 32.317, 12.653);
        path.lineTo(32.343, 8.188);
        path.close();
        path.moveTo(26.562, 11.031);
        path.lineTo(29.484, 11.031);
        path.lineTo(29.462, 14.941);
        path.lineTo(30.616, 15.167);
        path.curveTo(32.292, 15.496, 33.898, 16.147, 35.327, 17.078);
        path.lineTo(36.294, 17.709);
        path.lineTo(39.023, 14.97);
        path.lineTo(41.079, 16.995);
        path.lineTo(38.346, 19.735);
        path.lineTo(39.003, 20.706);
        path.curveTo(39.968, 22.163, 40.608, 23.737, 40.97, 25.358);
        path.lineTo(41.207, 26.496);
        path.lineTo(45.158, 26.472);
        path.lineTo(45.158, 29.338);
        path.lineTo(41.23, 29.362);
        path.lineTo(41.004, 30.5);
        path.curveTo(40.673, 32.17, 40.022, 33.76, 39.083, 35.186);
        path.lineTo(38.442, 36.16);
        path.lineTo(41.335, 39.012);
        path.lineTo(39.301, 41.053);
        path.lineTo(36.408, 38.2);
        path.lineTo(35.446, 38.839);
        path.curveTo(33.973, 39.802, 32.375, 40.469, 30.763, 40.797);
        path.lineTo(29.62, 41.025);
        path.lineTo(29.62, 45.176);
        path.curveTo(28.839, 45.178, 27.986, 45.176, 26.722, 45.175);
        path.lineTo(26.72, 41.055);
        path.lineTo(25.572, 40.831);
        path.curveTo(23.894, 40.503, 22.29, 39.855, 20.864, 38.92);
        path.lineTo(19.899, 38.288);
        path.lineTo(16.994, 41.179);
        path.lineTo(14.939, 39.159);
        path.lineTo(17.848, 36.261);
        path.lineTo(17.184, 35.286);
        path.curveTo(16.218, 33.833, 15.579, 32.257, 15.217, 30.637);
        path.lineTo(14.98, 29.503);
        path.lineTo(10.937, 29.518);
        path.lineTo(10.937, 26.648);
        path.lineTo(14.959, 26.641);
        path.lineTo(15.185, 25.498);
        path.curveTo(15.515, 23.829, 16.167, 22.239, 17.104, 20.816);
        path.lineTo(17.745, 19.843);
        path.lineTo(14.918, 17.05);
        path.lineTo(16.952, 15.005);
        path.lineTo(19.784, 17.802);
        path.lineTo(20.747, 17.159);
        path.curveTo(22.222, 16.194, 23.786, 15.553, 25.437, 15.197);
        path.lineTo(26.572, 14.961);
        path.close();
        path.moveTo(28.071, 21.475);
        path.curveTo(24.553, 21.475, 21.67, 24.358, 21.67, 27.876);
        path.curveTo(21.67, 31.394, 24.553, 34.277, 28.071, 34.277);
        path.curveTo(31.589, 34.277, 34.472, 31.394, 34.472, 27.876);
        path.curveTo(34.472, 24.358, 31.589, 21.475, 28.071, 21.475);
        path.close();
        path.moveTo(28.071, 24.317);
        path.curveTo(30.053, 24.317, 31.63, 25.894, 31.63, 27.876);
        path.curveTo(31.63, 29.858, 30.053, 31.434, 28.071, 31.434);
        path.curveTo(26.089, 31.434, 24.512, 29.858, 24.512, 27.876);
        path.curveTo(24.512, 25.894, 26.089, 24.317, 28.071, 24.317);
        path.close();
        path.fillAndStroke();
        super.redrawPath(path, x, y, w, h);
    }

}

class StartEventMessageShape extends ActorShape {
    constructor() {
        super();
    }

    override  redrawPath(path: SvgCanvas2D, x: number, y: number, w: number, h: number) {
        path.begin();
        path.moveTo(25.845, 0.128);
        path.curveTo(16.409, 0, 7.317, 6.073, 3.738, 14.789);
        path.curveTo(0, 23.353, 1.942, 33.991, 8.482, 40.67);
        path.curveTo(14.771, 47.44, 25.133, 49.925, 33.812, 46.758);
        path.curveTo(42.806, 43.695, 49.446, 34.862, 49.807, 25.355);
        path.curveTo(50.413, 16.014, 44.917, 6.694, 36.502, 2.625);
        path.curveTo(33.206, 0.98, 29.527, 0.123, 25.845, 0.128);
        path.close();
        path.moveTo(25.845, 2.722);
        path.curveTo(35.164, 2.56, 44.028, 9.254, 46.434, 18.258);
        path.curveTo(48.951, 26.738, 45.546, 36.556, 38.239, 41.578);
        path.curveTo(30.649, 47.157, 19.393, 46.753, 12.226, 40.64);
        path.curveTo(5.004, 34.882, 2.419, 24.231, 6.124, 15.785);
        path.curveTo(9.336, 7.977, 17.397, 2.623, 25.845, 2.722);
        path.close();
        path.moveTo(14.96, 15.82);
        path.lineTo(14.96, 32.424);
        path.lineTo(36.729, 32.424);
        path.curveTo(36.729, 26.889, 36.729, 21.355, 36.729, 15.82);
        path.curveTo(29.473, 15.82, 22.216, 15.82, 14.96, 15.82);
        path.close();
        path.moveTo(19.796, 18.414);
        path.lineTo(31.892, 18.414);
        path.curveTo(29.749, 19.732, 27.606, 22.627, 25.464, 22.942);
        path.curveTo(23.575, 21.433, 21.685, 19.923, 19.796, 18.414);
        path.close();
        path.moveTo(34.139, 19.941);
        path.lineTo(34.139, 29.83);
        path.curveTo(28.609, 29.83, 23.08, 29.83, 17.551, 29.83);
        path.curveTo(17.551, 26.534, 17.551, 23.238, 17.551, 19.942);
        path.curveTo(20.314, 22.151, 23.078, 24.36, 25.842, 26.568);
        path.curveTo(28.608, 24.359, 31.373, 22.15, 34.139, 19.941);
        path.close();
        path.fillAndStroke();
        super.redrawPath(path, x, y, w, h);
    }

}

class DataStoreShape extends ActorShape {
    constructor() {
        super();
    }

    override  redrawPath(path: SvgCanvas2D, x: number, y: number, w: number, h: number) {
        path.begin();
        path.moveTo(24.012, 0);
        path.curveTo(18.445, 0, 12.887, 0.459, 8.534, 1.408);
        path.curveTo(6.357, 1.883, 4.483, 2.473, 3.013, 3.247);
        path.curveTo(1.598, 3.993, 0.446, 4.955, 0.091, 6.346);
        path.curveTo(0.066, 6.418, 0.049, 6.493, 0.038, 6.569);
        path.lineTo(0, 6.755);
        path.lineTo(0.026, 6.881);
        path.curveTo(0.008, 17.994, 0.026, 28.57, 0.026, 40.001);
        path.lineTo(0.051, 40.124);
        path.curveTo(0.356, 41.602, 1.544, 42.608, 3.013, 43.382);
        path.curveTo(4.483, 44.156, 6.357, 44.746, 8.534, 45.221);
        path.curveTo(12.887, 46.17, 18.445, 46.629, 24.012, 46.629);
        path.curveTo(29.579, 46.629, 35.137, 46.17, 39.49, 45.221);
        path.curveTo(41.666, 44.746, 43.54, 44.156, 45.01, 43.382);
        path.curveTo(46.48, 42.608, 47.668, 41.602, 47.972, 40.124);
        path.lineTo(47.998, 40.001);
        path.curveTo(47.998, 29.07, 47.998, 17.165, 47.998, 6.811);
        path.curveTo(48, 6.758, 48, 6.705, 47.998, 6.652);
        path.lineTo(47.998, 6.629);
        path.lineTo(47.994, 6.609);
        path.curveTo(47.983, 6.507, 47.96, 6.408, 47.925, 6.313);
        path.curveTo(47.56, 4.94, 46.415, 3.987, 45.01, 3.247);
        path.curveTo(43.541, 2.473, 41.666, 1.883, 39.49, 1.408);
        path.curveTo(35.137, 0.459, 29.579, 0, 24.012, 0);
        path.close();
        path.moveTo(24.012, 2.469);
        path.curveTo(29.441, 2.469, 34.879, 2.93, 38.963, 3.821);
        path.curveTo(41.005, 4.266, 42.71, 4.826, 43.859, 5.432);
        path.curveTo(44.776, 5.915, 45.256, 6.396, 45.453, 6.755);
        path.curveTo(45.256, 7.114, 44.776, 7.594, 43.859, 8.077);
        path.curveTo(42.71, 8.683, 41.005, 9.243, 38.963, 9.688);
        path.curveTo(34.879, 10.579, 29.441, 11.04, 24.012, 11.04);
        path.curveTo(18.582, 11.04, 13.144, 10.579, 9.06, 9.688);
        path.curveTo(7.018, 9.243, 5.314, 8.683, 4.165, 8.077);
        path.curveTo(3.247, 7.594, 2.767, 7.114, 2.571, 6.755);
        path.curveTo(2.767, 6.396, 3.247, 5.915, 4.165, 5.432);
        path.curveTo(5.314, 4.826, 7.018, 4.266, 9.06, 3.821);
        path.curveTo(13.144, 2.93, 18.582, 2.469, 24.012, 2.469);
        path.close();
        path.moveTo(2.495, 9.971);
        path.curveTo(2.663, 10.071, 2.836, 10.169, 3.013, 10.262);
        path.curveTo(4.483, 11.036, 6.357, 11.626, 8.534, 12.101);
        path.curveTo(12.887, 13.05, 18.445, 13.509, 24.012, 13.509);
        path.curveTo(29.579, 13.509, 35.137, 13.05, 39.49, 12.101);
        path.curveTo(41.666, 11.626, 43.54, 11.036, 45.01, 10.262);
        path.curveTo(45.187, 10.169, 45.36, 10.071, 45.528, 9.971);
        path.lineTo(45.528, 12.866);
        path.curveTo(45.407, 13.233, 44.93, 13.794, 43.859, 14.358);
        path.curveTo(42.71, 14.964, 41.005, 15.524, 38.963, 15.969);
        path.curveTo(34.879, 16.86, 29.441, 17.321, 24.012, 17.321);
        path.curveTo(18.582, 17.321, 13.144, 16.86, 9.06, 15.969);
        path.curveTo(7.018, 15.524, 5.314, 14.964, 4.165, 14.358);
        path.curveTo(3.093, 13.794, 2.616, 13.233, 2.495, 12.866);
        path.close();
        path.moveTo(2.495, 16.252);
        path.curveTo(2.663, 16.352, 2.836, 16.449, 3.013, 16.543);
        path.curveTo(4.483, 17.317, 6.357, 17.907, 8.534, 18.382);
        path.curveTo(12.887, 19.331, 18.445, 19.79, 24.012, 19.79);
        path.curveTo(29.579, 19.79, 35.137, 19.331, 39.49, 18.382);
        path.curveTo(41.666, 17.907, 43.54, 17.317, 45.01, 16.543);
        path.curveTo(45.187, 16.449, 45.36, 16.352, 45.528, 16.252);
        path.lineTo(45.528, 19.146);
        path.curveTo(45.407, 19.514, 44.93, 20.074, 43.859, 20.639);
        path.curveTo(42.71, 21.245, 41.005, 21.805, 38.963, 22.25);
        path.curveTo(34.879, 23.141, 29.441, 23.602, 24.012, 23.602);
        path.curveTo(18.582, 23.602, 13.144, 23.141, 9.06, 22.25);
        path.curveTo(7.018, 21.805, 5.314, 21.245, 4.165, 20.639);
        path.curveTo(3.093, 20.074, 2.616, 19.514, 2.495, 19.146);
        path.close();
        path.moveTo(2.495, 22.532);
        path.curveTo(2.663, 22.633, 2.836, 22.73, 3.013, 22.824);
        path.curveTo(4.483, 23.598, 6.357, 24.188, 8.534, 24.663);
        path.curveTo(12.887, 25.612, 18.445, 26.071, 24.012, 26.071);
        path.curveTo(29.579, 26.071, 35.137, 25.612, 39.49, 24.663);
        path.curveTo(41.666, 24.188, 43.54, 23.598, 45.01, 22.824);
        path.curveTo(45.187, 22.73, 45.36, 22.633, 45.528, 22.532);
        path.lineTo(45.528, 39.705);
        path.curveTo(45.407, 40.072, 44.93, 40.633, 43.859, 41.197);
        path.curveTo(42.71, 41.803, 41.005, 42.363, 38.963, 42.808);
        path.curveTo(34.879, 43.699, 29.441, 44.16, 24.012, 44.16);
        path.curveTo(18.582, 44.16, 13.144, 43.699, 9.06, 42.808);
        path.curveTo(7.018, 42.363, 5.314, 41.803, 4.165, 41.197);
        path.curveTo(3.093, 40.633, 2.616, 40.072, 2.495, 39.705);
        path.close();
        path.fillAndStroke();
        super.redrawPath(path, x, y, w, h);
    }


}


