import "./Slider.css";
import { Component } from "react";
import Flicking, { ViewportSlot } from "@egjs/react-flicking";
import { Arrow } from "@egjs/flicking-plugins";
import "@egjs/flicking-plugins/dist/arrow.css";
import "@egjs/react-flicking/dist/flicking.css";
import "@egjs/flicking-plugins/dist/flicking-plugins.css";

export default class DemoComponent extends Component {
    _plugins = [new Arrow()];
    render() {

        const { data, navigate } = this.props;


        return <Flicking
            align={window.screen.width > 600 ? "prev" : "center"}
            circular={true}
            plugins={this._plugins}
            className="w-full"

        >
            {data.map((course, index) => {
                return (
                    <button key={course.id} onClick={() => navigate(`${course.id}`)}
                        className='max-w-full transform hover:scale-105 duration-150 shadow-md border border-gray-200 m-2
                             bg-white rounded-md flex justify-end items-center relative font-normal text-base p-5 h-[10rem] w-[25rem] text-right'>
                        <img className='object-cover w-24 top-0 left-0 h-[10rem] absolute rounded-l-lg ' src={course.cover} alt="" />
                        <div className='w-3/4 flex flex-col'>
                            <p className='font-semibold '>{course.title}</p>
                            <div className='flex items-center mt-3 ml-auto '>
                                <img src={course.professor?.profile_photo?.url} alt="" className='w-6 h-6 rounded-full' />
                                <p className='ml-2 text-sm '>{course?.professor?.username}</p>
                            </div>
                        </div>
                    </button>
                );
            })}
            <ViewportSlot>
                <span className="flicking-arrow-prev"></span>
                <span className="flicking-arrow-next"></span>
            </ViewportSlot>
        </Flicking>
    }
}

