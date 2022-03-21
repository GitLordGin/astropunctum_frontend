function MyListItem(props) {
    return(
        <div className="MyListItem">
            <p>{props.id}</p>
            <p>{props.name}</p>
            <p>{props.thumb}</p>
        </div>
    )
}

export default MyListItem;