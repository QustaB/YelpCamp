const mongoose = require( 'mongoose' );
const Review = require( './review' );
const Schema = mongoose.Schema;
const { cloudinary } = require( '../cloudinary' );


const ImageSchema = new Schema( {
    url: String,
    filename: String
} );

ImageSchema.virtual( 'thumbnail' ).get( function() {
    return this.url.replace( '/upload', '/upload/w_200' );
} );

ImageSchema.virtual( 'cardImage' ).get( function () {
    return this.url.replace( '/upload', '/upload/ar_4:3,c_crop' );
} );

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema( {
    title: String,
    images: [ ImageSchema ],
    geometry: {
        type: {
            type: String,
            enum: [ 'Point' ],
            required: true
        },
        coordinates: {
            type: [ Number ],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts );

CampgroundSchema.virtual( 'properties.popUpMarkup' ).get( function ()
{
    return `
        <strong><a href='/campgrounds/${ this._id }'>${ this.title }</a></strong>
        <p>${this.description.substring(0,20)}...</p>`
} );


CampgroundSchema.post( 'findOneAndDelete', async function ( doc )
{
    if ( doc.reviews )
    {
        await Review.deleteMany( {
            _id: {
                $in: doc.reviews
            }
        } )
    }
    if ( doc.images )
    {
        const seeds = [
            'YelpCamp/forestriver_jjqiuv.jpg',
            'YelpCamp/sunriver_nh5bus.jpg',
        ]
        for ( const img of doc.images )
        {
            if ( !( img.filename in seeds ) )
            {
                await cloudinary.uploader.destroy( img.filename );
            }
        }
    }
} );

module.exports = mongoose.model( 'campground', CampgroundSchema );