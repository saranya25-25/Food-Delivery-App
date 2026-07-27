import { Suspense } from "react";

import { Canvas } from "@react-three/fiber";

import {
    OrbitControls,
    useGLTF,
    Float
} from "@react-three/drei";

import "./Food3D.css";



const Burger = () => {


    const { scene } = useGLTF(
        "/models/burger.glb"
    );


    return (

        <primitive

            object={scene}

            scale={2.5}

            position={[0,-0.8,0]}

            rotation={[
                0,
                Math.PI / 4,
                0
            ]}

        />

    );

};





const Food3D = () => {


    return (


        <div className="food-3d">


            <Canvas

                camera={{

                    position:[
                        0,
                        0,
                        5
                    ],

                    fov:45

                }}

            >



                <ambientLight

                    intensity={2}

                />



                <directionalLight

                    position={[
                        5,
                        5,
                        5
                    ]}

                    intensity={3}

                />




                <Suspense fallback={null}>


                    <Float

                        speed={2}

                        rotationIntensity={1}

                        floatIntensity={1}

                    >

                        <Burger/>


                    </Float>


                </Suspense>




                <OrbitControls

                    enableZoom={false}

                    autoRotate

                    autoRotateSpeed={2}

                />


            </Canvas>


        </div>


    );


};



export default Food3D;