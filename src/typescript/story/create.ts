import { gensym } from '../gensym';
import { gist, GistParam } from '../gist';
import { HTMLElementTags, MergeWithHTMLProps, remove_custom_props } from '../jsx_utils';
import { split_tokens } from '../text_utils';
import { DeepFragment, Fragment, StoryNode } from './story';

export namespace JSX {
    export type Element = Fragment;

    export interface ElementChildrenAttribute {
		children: any;
    }

	export type IntrinsicElements = {
		[K in HTMLElementTags]: MergeWithHTMLProps<NodeProps>
	}
}

// creating story trees
export type NodeProps = (
	& {
		type?: undefined
		children?: DeepFragment,
        frame_index?: number,
        gist?: GistParam
	}
    & {
        className?: string
    }
);

// type StoryNodeTypeForProps<P extends NodeProps> = P['type'] extends keyof any ? StoryNodeTypes[P['type']] : StoryNode;

export type RendererBaseProps = { children?: Fragment[] };

export type StoryRenderer<P extends {}> = (props: P & RendererBaseProps) => StoryNode;

export function createElement<P extends {}>(tag: StoryRenderer<P>, props: P, ...deep_children: DeepFragment[]): StoryNode;
export function createElement<P extends NodeProps>(tag: string, props: MergeWithHTMLProps<P>, ...deep_children: DeepFragment[]): StoryNode;
export function createElement(tag: string | StoryRenderer<{}>, props: MergeWithHTMLProps<NodeProps>, ...deep_children: DeepFragment[]): StoryNode {
    // The jsx transformation appears to pass null as the second argument if none are provided.
    props = props || {};
    const children = deep_children.flat(Infinity);
    if (typeof(tag) === 'function') {
        return tag({...props, children})
    }
    
    const classes: Record<string, boolean> = {};
    if (props.className) {
        for (const c of split_tokens(props.className)) {
            classes[c] = true;
        }
    }

    let data: StoryNode['data'] = {};
    if (props.frame_index) {
        data.frame_index = props.frame_index;
    }
    if (props.gist) {
        data.gist = gist(props.gist);
    }

    const key = gensym();

    const attributes = remove_custom_props(props, {'frame_index': null, 'gist': null, 'type': null, 'className': null, 'children': null});
   
    return {
        kind: 'StoryNode',
        key,
        tag,
        classes,
        attributes,
        data,
        children
    }
}

import JSX_ = JSX;
export declare namespace createElement {
    export import JSX = JSX_;
}
